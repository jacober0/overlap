import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { createPlanExport } from './domain/export'
import { rankRecipes } from './domain/engine'
import { buildShoppingList } from './domain/shopping'
import type { Diet, Preferences, Recipe } from './domain/types'
import { recipes } from './recipes'
import { AccountPanel } from './components/AccountPanel'
import { useAccount } from './auth/useAccount'
import { loadProfilePreferences, saveProfilePreferences } from './data/profileRepository'

type Stage = 'onboarding' | 'discover' | 'plan' | 'shopping' | 'cook'
type SelectionAction = { kind: 'accepted' | 'rejected'; recipeId: string }
const initialPreferences: Preferences = { diet: 'vegetarisch', maxMinutes: 35, budgetFocus: .7, variety: .45, anchorTags: ['italienisch'], excludedIngredients: [], pantryIngredients: [], servings: 2, targetMeals: 5 }
const money = (value: number) => value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const stages: Stage[] = ['onboarding', 'discover', 'plan', 'shopping', 'cook']

function readJson<T>(key: string, fallback: T, isValid: (value: unknown) => boolean): T {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) || 'null')
    return isValid(value) ? value as T : fallback
  } catch {
    return fallback
  }
}

function readPreferences(): Preferences {
  const saved = readJson<Partial<Preferences>>('overlap-preferences', {}, value => Boolean(value) && typeof value === 'object' && !Array.isArray(value))
  return { ...initialPreferences, ...saved }
}

function readStage(): Stage {
  const saved = localStorage.getItem('overlap-stage') as Stage
  if (!stages.includes(saved)) return 'onboarding'
  if (['plan', 'shopping', 'cook'].includes(saved)) {
    try {
      const selection = JSON.parse(localStorage.getItem('overlap-selected') || '[]')
      if (!Array.isArray(selection)) return 'onboarding'
    } catch {
      return 'onboarding'
    }
  }
  return saved
}

function Logo() { return <div className="logo" aria-label="Overlap Startseite"><span>Over</span><span>lap</span></div> }

export default function App() {
  const [stage, setStage] = useState<Stage>(readStage)
  const [preferences, setPreferences] = useState<Preferences>(readPreferences)
  const [selected, setSelected] = useState<Recipe[]>(() => readJson('overlap-selected', [], Array.isArray))
  const [rejected, setRejected] = useState<string[]>([])
  const [selectionHistory, setSelectionHistory] = useState<SelectionAction[]>([])
  const [detail, setDetail] = useState(false)
  const [checked, setChecked] = useState<string[]>(() => readJson('overlap-checked', [], value => Array.isArray(value) && value.every(item => typeof item === 'string')))
  const [customItems, setCustomItems] = useState<string[]>(() => readJson('overlap-custom-items', [], value => Array.isArray(value) && value.every(item => typeof item === 'string')))
  const [customDraft, setCustomDraft] = useState('')
  const [cookingIndex, setCookingIndex] = useState(0)
  const [cookingStep, setCookingStep] = useState(0)
  const [accountOpen, setAccountOpen] = useState(false)
  const account = useAccount()

  useEffect(() => {
    const userId = account.session?.user.id
    if (!userId) return
    let active = true
    void loadProfilePreferences(userId, preferences).then(remote => {
      if (!active) return
      setPreferences(remote)
      localStorage.setItem('overlap-preferences', JSON.stringify(remote))
      if (remote === preferences) void saveProfilePreferences(userId, preferences)
    })
    return () => { active = false }
    // A session change is the synchronization boundary; local edits are saved by persist().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.session?.user.id])

  const persist = (nextStage: Stage, nextPreferences = preferences, nextSelected = selected) => {
    localStorage.setItem('overlap-stage', nextStage); localStorage.setItem('overlap-preferences', JSON.stringify(nextPreferences)); localStorage.setItem('overlap-selected', JSON.stringify(nextSelected)); setStage(nextStage)
    if (account.session) void saveProfilePreferences(account.session.user.id, nextPreferences)
  }
  const ranked = useMemo(() => rankRecipes(recipes.filter(r => !rejected.includes(r.id)), selected, preferences), [selected, rejected, preferences])
  const current = ranked[0]
  const shopping = useMemo(() => buildShoppingList(selected, preferences.servings), [selected, preferences.servings])
  const total = shopping.reduce((sum, item) => sum + item.estimatedCost, 0)
  const cookingRecipe = selected[cookingIndex]

  const startCooking = (index: number) => { setCookingIndex(index); setCookingStep(0); persist('cook') }
  const choose = () => { if (!current || selected.length >= Math.min(preferences.targetMeals, 7)) return; const next = [...selected, current.recipe]; setSelected(next); setSelectionHistory([...selectionHistory, { kind: 'accepted', recipeId: current.recipe.id }]); localStorage.setItem('overlap-selected', JSON.stringify(next)); setDetail(false) }
  const skip = () => { if (!current) return; setRejected([...rejected, current.recipe.id]); setSelectionHistory([...selectionHistory, { kind: 'rejected', recipeId: current.recipe.id }]); setDetail(false) }
  const undo = () => {
    const action = selectionHistory.at(-1)
    if (!action) return
    if (action.kind === 'accepted') {
      const index = selected.map(recipe => recipe.id).lastIndexOf(action.recipeId)
      const next = index < 0 ? selected : selected.filter((_, itemIndex) => itemIndex !== index)
      setSelected(next); localStorage.setItem('overlap-selected', JSON.stringify(next))
    } else {
      const index = rejected.lastIndexOf(action.recipeId)
      setRejected(index < 0 ? rejected : rejected.filter((_, itemIndex) => itemIndex !== index))
    }
    setSelectionHistory(selectionHistory.slice(0, -1))
  }
  const smartFill = () => {
    const target = Math.min(preferences.targetMeals, 7)
    const next = [...selected]
    const actions: SelectionAction[] = []
    while (next.length < target) {
      const candidate = rankRecipes(recipes.filter(recipe => !rejected.includes(recipe.id)), next, preferences)[0]?.recipe
      if (!candidate) break
      next.push(candidate); actions.push({ kind: 'accepted', recipeId: candidate.id })
    }
    setSelected(next); setSelectionHistory([...selectionHistory, ...actions]); localStorage.setItem('overlap-selected', JSON.stringify(next))
  }
  const removeSelected = (index: number) => { const next = selected.filter((_, itemIndex) => itemIndex !== index); setSelected(next); localStorage.setItem('overlap-selected', JSON.stringify(next)) }
  const duplicateSelected = (index: number) => {
    if (selected.length >= Math.min(preferences.targetMeals, 7) || !selected[index]) return
    const next = [...selected, selected[index]]; setSelected(next); localStorage.setItem('overlap-selected', JSON.stringify(next))
  }
  const toggleChecked = (itemKey: string) => {
    const next = checked.includes(itemKey) ? checked.filter(key => key !== itemKey) : [...checked, itemKey]
    setChecked(next)
    localStorage.setItem('overlap-checked', JSON.stringify(next))
  }
  const persistCustomItems = (items: string[]) => { setCustomItems(items); localStorage.setItem('overlap-custom-items', JSON.stringify(items)) }
  const addCustomItem = () => {
    const item = customDraft.trim()
    if (!item || customItems.some(value => value.toLocaleLowerCase('de-DE') === item.toLocaleLowerCase('de-DE'))) return
    persistCustomItems([...customItems, item]); setCustomDraft('')
  }
  const downloadPlan = () => {
    const blob = new Blob([createPlanExport(selected, shopping, preferences.servings, customItems)], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url; link.download = 'overlap-wochenplan.txt'; link.click()
    URL.revokeObjectURL(url)
  }

  return <div className="app">
    <header><Logo /><nav aria-label="Hauptnavigation">
      <button className={stage === 'discover' ? 'active' : ''} onClick={() => persist('discover')}>Entdecken</button>
      <button className={stage === 'plan' || stage === 'cook' ? 'active' : ''} onClick={() => persist('plan')}>Wochenplan <b>{selected.length || ''}</b></button>
      <button className={stage === 'shopping' ? 'active' : ''} onClick={() => persist('shopping')}>Einkauf</button>
    </nav><button className="avatar" onClick={() => setAccountOpen(true)} aria-label="Profil und Konto öffnen">JR</button></header>

    {stage === 'onboarding' && <main className="onboarding">
      <section className="intro"><span className="eyebrow">Dein persönlicher Sweetspot</span><h1>Was soll diese Woche <em>leichter</em> machen?</h1><p>Overlap verbindet Gerichte über gemeinsame Zutaten – ohne dass jede Mahlzeit gleich schmeckt.</p><div className="overlap-mark"><span>weniger planen</span><span>cleverer einkaufen</span></div></section>
      <section className="setup-card">
        <div className="step"><span>01</span><div><h2>Wie isst du?</h2><p>Harte Filter werden immer respektiert.</p></div></div>
        <div className="segmented">{(['omnivor','vegetarisch','vegan'] as Diet[]).map(d => <button key={d} className={preferences.diet === d ? 'selected' : ''} onClick={() => setPreferences({...preferences,diet:d})}>{d[0].toUpperCase()+d.slice(1)}</button>)}</div>
        <div className="profile-grid">
          <label><span>Mahlzeiten pro Woche</span><select aria-label="Mahlzeiten pro Woche" value={preferences.targetMeals} onChange={e=>setPreferences({...preferences,targetMeals:+e.target.value})}>{[1,2,3,4,5,6,7].map(value=><option key={value} value={value}>{value}</option>)}</select></label>
          <label><span>Portionen pro Gericht</span><select aria-label="Portionen pro Gericht" value={preferences.servings} onChange={e=>setPreferences({...preferences,servings:+e.target.value})}>{[1,2,3,4,5,6].map(value=><option key={value} value={value}>{value}</option>)}</select></label>
        </div>
        <div className="exclusions"><span>Nicht in meiner Woche</span><div className="chips">{[{id:'tomate',name:'Tomaten'},{id:'paprika',name:'Paprika'},{id:'spinat',name:'Spinat'},{id:'tofu',name:'Tofu'}].map(item=>{const active=preferences.excludedIngredients.includes(item.id);return <button type="button" key={item.id} className={active?'selected':''} aria-label={`${item.name} ${active?'zulassen':'ausschließen'}`} onClick={()=>setPreferences({...preferences,excludedIngredients:active?preferences.excludedIngredients.filter(id=>id!==item.id):[...preferences.excludedIngredients,item.id]})}>{active?'− ':'+ '}{item.name}</button>})}</div></div>
        <div className="exclusions pantry"><span>Schon im Vorrat</span><div className="chips">{[{id:'tomate',name:'Tomaten'},{id:'kichererbse',name:'Kichererbsen'},{id:'reis',name:'Reis'},{id:'spinat',name:'Spinat'}].map(item=>{const active=preferences.pantryIngredients.includes(item.id);return <button type="button" key={item.id} className={active?'selected':''} aria-pressed={active} onClick={()=>setPreferences({...preferences,pantryIngredients:active?preferences.pantryIngredients.filter(id=>id!==item.id):[...preferences.pantryIngredients,item.id]})}>{active?'✓ ':'+ '}{item.name}</button>})}</div></div>
        <div className="step"><span>02</span><div><h2>Dein Wochenrhythmus</h2><p>Damit Vorschläge wirklich in deinen Alltag passen.</p></div></div>
        <label className="range-row"><span>Maximale Kochzeit <b>{preferences.maxMinutes} Min.</b></span><input aria-label="Maximale Kochzeit" type="range" min="15" max="60" step="5" value={preferences.maxMinutes} onChange={e=>setPreferences({...preferences,maxMinutes:+e.target.value})}/></label>
        <label className="range-row"><span>Budgetfokus <b>{Math.round(preferences.budgetFocus*100)}%</b></span><input aria-label="Budgetfokus" type="range" min="0" max="1" step=".1" value={preferences.budgetFocus} onChange={e=>setPreferences({...preferences,budgetFocus:+e.target.value})}/></label>
        <div className="step"><span>03</span><div><h2>Worauf hast du Lust?</h2><p>Wähle eine Geschmacksrichtung als Startanker.</p></div></div>
        <div className="chips">{['italienisch','asiatisch','mediterran','orientalisch','deutsch'].map(tag=><button key={tag} className={preferences.anchorTags.includes(tag)?'selected':''} onClick={()=>setPreferences({...preferences,anchorTags:[tag]})}>{tag}</button>)}</div>
        <button className="primary wide" onClick={()=>persist('discover',preferences)}>Vorschläge entdecken <span>→</span></button>
        <small>Alles bleibt lokal in diesem Browser gespeichert.</small>
      </section>
    </main>}

    {stage === 'discover' && <main className="discover">
      <section className="discover-head"><div><span className="eyebrow">Smart Fill · {ranked.length} Treffer</span><h1>Dein nächster Treffer</h1><p>Mit jeder Auswahl wird der gemeinsame Einkauf schlauer.</p></div><div className="sweetspot"><div><span>Effizient</span><span>Abwechslungsreich</span></div><input aria-label="Effizienz oder Abwechslung" type="range" min="0" max="1" step=".05" value={preferences.variety} onChange={e=>setPreferences({...preferences,variety:+e.target.value})}/><strong>{preferences.variety < .4 ? 'Mehr Zutaten-Overlap' : preferences.variety > .65 ? 'Mehr Vielfalt' : 'Dein Sweetspot'}</strong></div></section>
      <section className="discover-grid">
        {current ? <article className="recipe-card"><div className="image-wrap"><img src={current.recipe.image} alt={current.recipe.title}/><span className="score">{current.total}% Match</span><button className="info" onClick={()=>setDetail(true)} aria-label="Rezeptdetails öffnen">i</button></div><div className="recipe-body"><div className="meta"><span>{current.recipe.minutes} Min.</span><span>{money(current.recipe.pricePerServing)} / Portion</span><span>{current.recipe.diet}</span></div><h2>{current.recipe.title}</h2><p>{current.recipe.description}</p><div className="tags">{current.recipe.tags.map(t=><span key={t}>{t}</span>)}</div><div className="nutrition"><span><b>{current.recipe.nutrition.kcal}</b> kcal</span><span><b>{current.recipe.nutrition.protein} g</b> Protein</span><span><b>{current.recipe.nutrition.fiber} g</b> Ballastst.</span></div></div><div className="actions"><button className="reject" onClick={skip}>Nein</button><button className="accept" onClick={choose}>Geil <span>♥</span></button></div></article> : <div className="empty"><h2>Alle passenden Gerichte gesehen</h2><p>Passe Kochzeit oder Ernährungsform an.</p><button onClick={()=>setRejected([])}>Neu starten</button></div>}
        <aside><div className="why"><span className="eyebrow">Warum passt das?</span>{current?.reasons.map((reason,index)=><div className="reason" key={reason}><b>{index+1}</b><span>{reason}</span></div>)}<details><summary>Score transparent anzeigen</summary>{current && Object.entries(current.breakdown).map(([key,value])=><div className="scoreline" key={key}><span>{key}</span><progress max="1" value={value}/></div>)}</details></div><div className="selection"><div><span>Deine Woche</span><strong>{selected.length} / {preferences.targetMeals} Gerichte</strong></div><div className="mini-list">{selected.slice(-3).map(r=><span key={r.id}>{r.title}</span>)}</div><button className="smart-fill" disabled={selected.length>=Math.min(preferences.targetMeals,7)} onClick={smartFill}>✦ Smart Fill für {preferences.targetMeals} Gerichte</button><button className="primary" disabled={!selected.length} onClick={()=>persist('plan')}>Wochenplan öffnen →</button><button className="undo" disabled={!selectionHistory.length} onClick={undo}>↶ Letzte Aktion rückgängig</button></div></aside>
      </section>
    </main>}

    {stage === 'plan' && <main className="page"><div className="page-title"><div><span className="eyebrow">Deine Planung</span><h1>Eine Woche, die zusammenpasst.</h1></div><button className="primary" onClick={()=>persist('discover')}>+ Gericht ergänzen</button></div><div className="week-grid">{days.map((day,index)=>{const recipe=selected[index];return <article className={recipe?'day filled':'day'} key={day}><span>{day}</span>{recipe?<><img src={recipe.image} alt=""/><h3>{recipe.title}</h3><p>{recipe.minutes} Min. · {money(recipe.pricePerServing)}</p><div className="day-actions"><button className="day-cook" aria-label={`${recipe.title} kochen`} onClick={()=>startCooking(index)}>Kochen</button><button className="day-repeat" aria-label={`${recipe.title} als Meal Prep wiederholen`} onClick={()=>duplicateSelected(index)} disabled={selected.length>=Math.min(preferences.targetMeals,7)}>+ Prep</button><button className="day-remove" aria-label={`${recipe.title} entfernen`} onClick={()=>removeSelected(index)}>Entfernen</button></div></>:<><div className="plus">+</div><p>Noch frei</p></>}</article>})}</div><section className="plan-summary"><div><span>Geschätzter Einkauf</span><strong>{money(total)}</strong><small>auf Basis der Seed-Preise</small></div><div><span>Gemeinsame Zutaten</span><strong>{shopping.filter(item=>item.recipes.length>1).length}</strong><small>in mehreren Gerichten</small></div><button className="primary" disabled={!selected.length} onClick={()=>persist('shopping')}>Einkaufsliste erstellen →</button></section></main>}

    {stage === 'cook' && <main className="cook-page">{cookingRecipe ? <><section className="cook-hero"><button className="cook-back" onClick={()=>persist('plan')}>← Wochenplan</button><span className="eyebrow">Kochmodus · {preferences.servings} Portionen</span><h1>{cookingRecipe.title}</h1><p>{cookingRecipe.description}</p><img src={cookingRecipe.image} alt={cookingRecipe.title}/></section><section className="cook-workspace"><aside className="cook-ingredients"><h2>Zutaten</h2>{cookingRecipe.ingredients.map(ingredient=>{const amount=Math.round(ingredient.amount*(preferences.servings/cookingRecipe.servings)*100)/100;return <div key={`${ingredient.id}:${ingredient.unit}`}><span>{ingredient.name}</span><b>{amount} {ingredient.unit}</b></div>})}</aside><article className="cook-step"><span className="eyebrow">Schritt {cookingStep+1} von {cookingRecipe.steps.length}</span><progress max={cookingRecipe.steps.length} value={cookingStep+1}/><p>{cookingRecipe.steps[cookingStep]}</p><div><button disabled={cookingStep===0} onClick={()=>setCookingStep(Math.max(0,cookingStep-1))}>Zurück</button><button className="primary" aria-label={cookingStep===cookingRecipe.steps.length-1?'Kochen abschließen':'Nächster Schritt'} onClick={()=>cookingStep===cookingRecipe.steps.length-1?persist('plan'):setCookingStep(cookingStep+1)}>{cookingStep===cookingRecipe.steps.length-1?'Fertig':'Nächster Schritt'} →</button></div></article></section></> : <div className="empty"><h2>Kein Gericht ausgewählt</h2><button onClick={()=>persist('plan')}>Zum Wochenplan</button></div>}</main>}

    {stage === 'shopping' && <main className="page shopping"><div className="page-title"><div><span className="eyebrow">Automatisch gebündelt</span><h1>Ein Einkauf. Alles für die Woche.</h1></div><div className="shopping-head-actions"><button className="export-button" onClick={downloadPlan}>↓ Als Text exportieren</button><div className="total"><span>Geschätzt</span><strong>{money(total)}</strong></div></div></div>{[...new Set(shopping.map(i=>i.category))].map(category=><section className="shopping-group" key={category}><h2>{category}</h2>{shopping.filter(i=>i.category===category).map(item=>{const itemKey=`${item.id}:${item.unit}`;return <label className={checked.includes(itemKey)?'checked':''} key={itemKey}><input type="checkbox" data-item-id={itemKey} checked={checked.includes(itemKey)} onChange={()=>toggleChecked(itemKey)}/><span className="checkmark">✓</span><span className="item-name"><b>{item.name}</b><small>für {item.recipes.join(', ')}</small></span><span>{item.amount} {item.unit}</span><strong>{money(item.estimatedCost)}</strong></label>})}</section>)}<section className="shopping-group custom-shopping"><h2>Eigene Ergänzungen</h2><div className="custom-add"><input aria-label="Eigene Einkaufsposition" value={customDraft} onChange={event=>setCustomDraft(event.target.value)} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();addCustomItem()}}} placeholder="z. B. Hafermilch"/><button type="button" className="primary" onClick={addCustomItem}>Hinzufügen</button></div>{customItems.map(item=>{const itemKey=`custom:${item.toLocaleLowerCase('de-DE')}`;return <div className={`custom-item ${checked.includes(itemKey)?'checked':''}`} key={itemKey}><button type="button" className="checkmark" aria-label={`${item} abhaken`} onClick={()=>toggleChecked(itemKey)}>✓</button><b>{item}</b><button type="button" className="custom-remove" aria-label={`${item} entfernen`} onClick={()=>persistCustomItems(customItems.filter(value=>value!==item))}>Entfernen</button></div>})}</section>{!shopping.length&&!customItems.length&&<div className="empty"><h2>Noch keine Zutaten</h2><button onClick={()=>persist('discover')}>Gerichte auswählen</button></div>}</main>}

    {detail && current && <div className="modal-backdrop" onClick={()=>setDetail(false)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="recipe-detail" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setDetail(false)} aria-label="Schließen">×</button><img src={current.recipe.image} alt=""/><div className="modal-content"><span className="eyebrow">{current.recipe.diet} · {current.recipe.difficulty}</span><h2 id="recipe-detail">{current.recipe.title}</h2><p>{current.recipe.description}</p><h3>Zutaten für {current.recipe.servings} Portionen</h3><ul>{current.recipe.ingredients.map(i=><li key={i.id}><span>{i.name}</span><b>{i.amount} {i.unit}</b></li>)}</ul><h3>Zubereitung</h3><ol>{current.recipe.steps.map(step=><li key={step}>{step}</li>)}</ol><button className="primary wide" onClick={choose}>Zum Wochenplan hinzufügen</button></div></section></div>}
    {accountOpen && <AccountPanel account={account} onClose={() => setAccountOpen(false)} onEditPreferences={() => { setAccountOpen(false); persist('onboarding') }} />}
  </div>
}
