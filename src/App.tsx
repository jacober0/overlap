import { useMemo, useState } from 'react'
import './App.css'
import { rankRecipes } from './domain/engine'
import { buildShoppingList } from './domain/shopping'
import type { Diet, Preferences, Recipe } from './domain/types'
import { recipes } from './recipes'

type Stage = 'onboarding' | 'discover' | 'plan' | 'shopping'
const initialPreferences: Preferences = { diet: 'vegetarisch', maxMinutes: 35, budgetFocus: .7, variety: .45, anchorTags: ['italienisch'], excludedIngredients: [], servings: 2 }
const money = (value: number) => value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })
const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

function Logo() { return <div className="logo" aria-label="Overlap Startseite"><span>Over</span><span>lap</span></div> }

export default function App() {
  const [stage, setStage] = useState<Stage>(() => localStorage.getItem('overlap-stage') as Stage || 'onboarding')
  const [preferences, setPreferences] = useState<Preferences>(() => JSON.parse(localStorage.getItem('overlap-preferences') || 'null') || initialPreferences)
  const [selected, setSelected] = useState<Recipe[]>(() => JSON.parse(localStorage.getItem('overlap-selected') || '[]'))
  const [rejected, setRejected] = useState<string[]>([])
  const [detail, setDetail] = useState(false)
  const [checked, setChecked] = useState<string[]>([])

  const persist = (nextStage: Stage, nextPreferences = preferences, nextSelected = selected) => {
    localStorage.setItem('overlap-stage', nextStage); localStorage.setItem('overlap-preferences', JSON.stringify(nextPreferences)); localStorage.setItem('overlap-selected', JSON.stringify(nextSelected)); setStage(nextStage)
  }
  const ranked = useMemo(() => rankRecipes(recipes.filter(r => !rejected.includes(r.id)), selected, preferences), [selected, rejected, preferences])
  const current = ranked[0]
  const shopping = useMemo(() => buildShoppingList(selected), [selected])
  const total = shopping.reduce((sum, item) => sum + item.estimatedCost, 0)

  const choose = () => { if (!current) return; const next = [...selected, current.recipe]; setSelected(next); localStorage.setItem('overlap-selected', JSON.stringify(next)); setDetail(false) }
  const skip = () => { if (current) setRejected([...rejected, current.recipe.id]); setDetail(false) }
  const undo = () => { if (rejected.length) setRejected(rejected.slice(0, -1)); else { const next = selected.slice(0, -1); setSelected(next); localStorage.setItem('overlap-selected', JSON.stringify(next)) } }

  return <div className="app">
    <header><Logo /><nav aria-label="Hauptnavigation">
      <button className={stage === 'discover' ? 'active' : ''} onClick={() => persist('discover')}>Entdecken</button>
      <button className={stage === 'plan' ? 'active' : ''} onClick={() => persist('plan')}>Wochenplan <b>{selected.length || ''}</b></button>
      <button className={stage === 'shopping' ? 'active' : ''} onClick={() => persist('shopping')}>Einkauf</button>
    </nav><button className="avatar" onClick={() => persist('onboarding')} aria-label="Präferenzen bearbeiten">JR</button></header>

    {stage === 'onboarding' && <main className="onboarding">
      <section className="intro"><span className="eyebrow">Dein persönlicher Sweetspot</span><h1>Was soll diese Woche <em>leichter</em> machen?</h1><p>Overlap verbindet Gerichte über gemeinsame Zutaten – ohne dass jede Mahlzeit gleich schmeckt.</p><div className="overlap-mark"><span>weniger planen</span><span>cleverer einkaufen</span></div></section>
      <section className="setup-card">
        <div className="step"><span>01</span><div><h2>Wie isst du?</h2><p>Harte Filter werden immer respektiert.</p></div></div>
        <div className="segmented">{(['omnivor','vegetarisch','vegan'] as Diet[]).map(d => <button key={d} className={preferences.diet === d ? 'selected' : ''} onClick={() => setPreferences({...preferences,diet:d})}>{d[0].toUpperCase()+d.slice(1)}</button>)}</div>
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
        <aside><div className="why"><span className="eyebrow">Warum passt das?</span>{current?.reasons.map((reason,index)=><div className="reason" key={reason}><b>{index+1}</b><span>{reason}</span></div>)}<details><summary>Score transparent anzeigen</summary>{current && Object.entries(current.breakdown).map(([key,value])=><div className="scoreline" key={key}><span>{key}</span><progress max="1" value={value}/></div>)}</details></div><div className="selection"><div><span>Deine Woche</span><strong>{selected.length} / 7 Gerichte</strong></div><div className="mini-list">{selected.slice(-3).map(r=><span key={r.id}>{r.title}</span>)}</div><button className="primary" disabled={!selected.length} onClick={()=>persist('plan')}>Wochenplan öffnen →</button><button className="undo" disabled={!selected.length&&!rejected.length} onClick={undo}>↶ Letzte Aktion rückgängig</button></div></aside>
      </section>
    </main>}

    {stage === 'plan' && <main className="page"><div className="page-title"><div><span className="eyebrow">Deine Planung</span><h1>Eine Woche, die zusammenpasst.</h1></div><button className="primary" onClick={()=>persist('discover')}>+ Gericht ergänzen</button></div><div className="week-grid">{days.map((day,index)=>{const recipe=selected[index];return <article className={recipe?'day filled':'day'} key={day}><span>{day}</span>{recipe?<><img src={recipe.image} alt=""/><h3>{recipe.title}</h3><p>{recipe.minutes} Min. · {money(recipe.pricePerServing)}</p></>:<><div className="plus">+</div><p>Noch frei</p></>}</article>})}</div><section className="plan-summary"><div><span>Geschätzter Einkauf</span><strong>{money(total)}</strong><small>auf Basis der Seed-Preise</small></div><div><span>Gemeinsame Zutaten</span><strong>{shopping.filter(item=>item.recipes.length>1).length}</strong><small>in mehreren Gerichten</small></div><button className="primary" disabled={!selected.length} onClick={()=>persist('shopping')}>Einkaufsliste erstellen →</button></section></main>}

    {stage === 'shopping' && <main className="page shopping"><div className="page-title"><div><span className="eyebrow">Automatisch gebündelt</span><h1>Ein Einkauf. Alles für die Woche.</h1></div><div className="total"><span>Geschätzt</span><strong>{money(total)}</strong></div></div>{[...new Set(shopping.map(i=>i.category))].map(category=><section className="shopping-group" key={category}><h2>{category}</h2>{shopping.filter(i=>i.category===category).map(item=><label className={checked.includes(item.id)?'checked':''} key={`${item.id}:${item.unit}`}><input type="checkbox" checked={checked.includes(item.id)} onChange={()=>setChecked(checked.includes(item.id)?checked.filter(x=>x!==item.id):[...checked,item.id])}/><span className="checkmark">✓</span><span className="item-name"><b>{item.name}</b><small>für {item.recipes.join(', ')}</small></span><span>{item.amount} {item.unit}</span><strong>{money(item.estimatedCost)}</strong></label>)}</section>)}{!shopping.length&&<div className="empty"><h2>Noch keine Zutaten</h2><button onClick={()=>persist('discover')}>Gerichte auswählen</button></div>}</main>}

    {detail && current && <div className="modal-backdrop" onClick={()=>setDetail(false)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="recipe-detail" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setDetail(false)} aria-label="Schließen">×</button><img src={current.recipe.image} alt=""/><div className="modal-content"><span className="eyebrow">{current.recipe.diet} · {current.recipe.difficulty}</span><h2 id="recipe-detail">{current.recipe.title}</h2><p>{current.recipe.description}</p><h3>Zutaten für {current.recipe.servings} Portionen</h3><ul>{current.recipe.ingredients.map(i=><li key={i.id}><span>{i.name}</span><b>{i.amount} {i.unit}</b></li>)}</ul><h3>Zubereitung</h3><ol>{current.recipe.steps.map(step=><li key={step}>{step}</li>)}</ol><button className="primary wide" onClick={choose}>Zum Wochenplan hinzufügen</button></div></section></div>}
  </div>
}
