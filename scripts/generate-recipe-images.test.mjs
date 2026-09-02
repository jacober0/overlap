import { describe, expect, it } from 'vitest'
import {
  ENV_PATH,
  OVERLAP_STYLE_PRESET,
  buildPrompt,
  decodeImageResponse,
  detectImageFormat,
  parseArgs,
  recipeImageManifest,
  requestImage,
  selectRecipes,
} from './generate-recipe-images.mjs'

const jpeg = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0xff, 0xd9])

const response = (contentType, bytes, ok = true, status = 200) => ({
  ok,
  status,
  headers: { get: (name) => name.toLowerCase() === 'content-type' ? contentType : null },
  arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
})

describe('recipe image manifest and prompt contract', () => {
  it('includes the sixty-second recipe batch in the image manifest', () => {
    expect(recipeImageManifest.slice(-3).map(({ id }) => id)).toEqual([
      'lupinen-spinat-dinkel-pelmeni-paprikabruehe',
      'haehnchen-pastinaken-haferkuechle-lauchgemuese',
      'bohnen-kuerbis-teff-injera-mangold',
    ])
  })

  it('defines exactly one dish-specific prompt for every local publishable recipe', () => {
    expect(recipeImageManifest).toHaveLength(207)
    expect(recipeImageManifest.map(({ id }) => id)).toEqual([
      'tomatenpasta', 'kichererbsencurry', 'ofengemuese', 'linsenbolognese',
      'tacos', 'reisbowl', 'shakshuka', 'gnocchi', 'haehnchenblech',
      'kartoffelsuppe', 'couscous', 'salat',
      'rote-linsen-kokos-suppe', 'pilz-graupen-risotto',
      'zucchini-kartoffel-roesti', 'paprika-bohnen-reis',
      'fenchel-bohnen-schmortopf', 'suesskartoffel-kichererbsen-blech',
      'spinat-kartoffel-frittata', 'haehnchen-linsen-pfanne',
      'buchweizen-rote-bete-salat', 'wirsing-kartoffel-bohnen-pfanne',
      'kabeljau-tomaten-orzo', 'puten-hirse-baellchen',
      'kuerbis-dinkel-pfanne', 'lachs-bohnen-kartoffel-salat',
      'blumenkohl-erbsen-dal', 'rind-paprika-polenta',
      'auberginen-linsen-bulgur', 'tofu-brokkoli-erdnuss-nudeln',
      'schweinefilet-apfel-wirsing', 'mangold-ricotta-cannelloni',
      'rosenkohl-kartoffel-linsen-blech', 'seelachs-lauch-kartoffel-topf',
      'paprika-hirse-pfanne-halloumi', 'kuerbis-bohnen-chili',
      'pastinaken-weisse-bohnen-suppe', 'haehnchen-spitzkohl-reis-pfanne',
      'rote-bete-kartoffel-gratin', 'garnelen-erbsen-dinkel-orzotto',
      'weisse-bohnen-polenta-auflauf', 'puten-kuerbis-bulgur-pfanne',
      'linsen-wurzelgemuese-hirse-topf', 'forelle-rote-bete-graupen-salat',
      'gruenkohl-kartoffel-kichererbsen-pfanne', 'pilz-lauch-spaetzle-walnuss',
      'ofenlachs-linsen-fenchel', 'tofu-rotkohl-soba-pfanne',
      'miso-kuerbis-udon-pak-choi', 'lauch-birnen-quiche',
      'rind-rote-bete-borschtsch',
      'sellerie-schnitzel-kartoffel-gurken-salat',
      'haehnchen-apfel-curry-naturreis', 'bohnen-mais-enchiladas',
      'kartoffel-lauch-linsen-pastete', 'kabeljau-kichererbsen-tagine',
      'brokkoli-kaese-hirse-taler',
      'kohlrabi-dinkel-erbsen-ragout', 'haehnchen-pflaumen-couscous',
      'auberginen-quinoa-boote',
      'wirsing-pilz-buchweizen-rouladen', 'muschel-fenchel-kartoffel-topf',
      'puten-suesskartoffel-erdnuss-eintopf',
      'schwarzwurzel-linsen-haselnuss-pfanne',
      'heilbutt-spinat-kartoffel-paeckchen', 'reh-wurzelgemuese-dinkel-topf',
      'artischocken-erbsen-risotto', 'lamm-kofta-kichererbsen-blech',
      'quark-mohn-schmarrn-zwetschgen',
      'eier-senfsauce-spinatkartoffeln', 'maronen-rosenkohl-graupenpfanne',
      'schweinegeschnetzeltes-kohlrabi-vollkornreis',
      'raeuchertofu-steckrueben-gulasch', 'makrelen-linsen-apfel-salat',
      'kuerbis-spinat-polenta-schnitten',
      'linsen-pilz-walnuss-braten', 'saibling-kohlrabi-dinkel-risotto',
      'rind-bohnen-kuerbis-pfanne',
      'hirse-pilz-kohlrouladen', 'puten-zucchini-mais-laibchen',
      'birnen-bohnen-kartoffel-eintopf',
      'herings-kartoffel-rote-bete-salat',
      'okra-linsen-hirse-eintopf',
      'spargel-dinkel-crepes-kraeuterquark',
      'miso-auberginen-edamame-reis',
      'ricotta-spinat-knoedel-tomatenragout',
      'haehnchen-aprikosen-gersten-pilaw',
      'tempeh-sauerkraut-kartoffel-pfanne',
      'buchweizen-pilz-blini-rote-bete-quark',
      'dorade-fenchel-bohnen-blech',
      'lauch-tofu-wan-tan-suppe',
      'forellen-wirsing-kartoffel-auflauf',
      'rinderhack-paprika-buchweizen-pfanne',
      'lupinen-kartoffel-gulasch',
      'ziegenkaese-polenta-pfirsich',
      'huehnchen-bohnen-jambalaya',
      'rote-bete-bohnen-knoedel-wirsing',
      'sardinen-tomaten-vollkorn-couscous',
      'polenta-bohnen-tamale-auflauf',
      'gruenkern-zucchini-laibchen-tomatenbohnen',
      'schweinefilet-linsen-aprikosen-tagine',
      'tofu-mais-okonomiyaki',
      'seitan-pilz-wurzelgemuese-pie',
      'zander-senfkohl-hirse-paeckchen',
      'linsen-mangold-moussaka',
      'kuerbis-walnuss-lobio',
      'haehnchen-blumenkohl-buchweizen-blech',
      'spinat-paneer-kofta-curry',
      'gochujang-tempeh-glasnudelsalat',
      'ofenmakrele-rote-bete-meerrettich-hirse',
      'fenchel-linsen-lasagne-ziegenkaese',
      'kartoffel-erbsen-samosa-blech',
      'rind-brokkoli-udon-pfanne',
      'kichererbsen-mangold-farinata',
      'linsen-bulgur-koefte-schmorgemuese',
      'schweinehack-zitronengras-reisnudel-bowl',
      'lauch-linsen-buchweizen-galette',
      'aloo-tikki-linsen-raita',
      'garnelen-kuerbis-gnocchi-salbei',
      'puten-sellerie-paprikasch-dinkelspaetzle',
      'kimchi-tofu-kartoffel-eintopf',
      'seelachs-linsen-frikadellen-fenchelsalat',
      'mais-spinat-quinoa-puffer-bohnen-salsa',
      'weisse-bohnen-kuerbis-cassoulet',
      'saibling-mais-kartoffel-chowder',
      'rind-wirsing-pflaumen-schmortopf',
      'dinkel-maultaschen-kuerbis-linsen',
      'muschel-paprika-fregola',
      'brokkoli-kichererbsen-pakora-tomatenchutney',
      'rosenkohl-tempeh-bulgur-pilaw',
      'mangold-kartoffel-souffle',
      'puten-kohlrabi-rouladen-hirse',
      'erdnuss-auberginen-kochbananen-topf',
      'gochujang-lachs-gerste-pak-choi',
      'gefuellte-paprika-gruenkern-linsen',
      'spargel-linsen-erdbeer-salat',
      'forellen-hirse-kuechle-gurkensalat',
      'haehnchen-rhabarber-kichererbsen-tagine',
      'tofu-ananas-naturreis-pfanne',
      'tintenfisch-bohnen-polenta',
      'sellerie-linsen-strudel-apfelkraut',
      'raeuchertofu-brokkoli-dinkel-blech',
      'kabeljau-linsen-kokos-paeckchen',
      'pastinaken-buchweizen-gnocchi',
      'bohnen-rote-bete-falafel-hirse-taboule',
      'zander-sauerkraut-kartoffel-groestl',
      'puten-auberginen-bulgur-koefte-auflauf',
      'kartoffel-bohnen-pupusas-rotkohlsalat',
      'lachs-spinat-hirse-terrine-fenchelsalat',
      'rind-lauch-graupen-kroketten-rote-bete-joghurt',
      'tomaten-dill-gigantes-gerste-mangold',
      'lachs-kohl-okonomiyaki-edamame',
      'kuerbis-quark-knoedel-pilzragout',
      'sellerie-adzuki-miso-blech-sesam-hirse',
      'mangold-linsen-goezleme-paprika-joghurt',
      'haehnchen-shiitake-gyoza-spitzkohlsalat',
      'schwarze-bohnen-mais-arepas-kuerbis-salsa',
      'ei-pilz-buchweizen-bibimbap',
      'schellfisch-lauch-hafer-crumble',
      'weisse-bohnen-mangold-ribollita-polenta-crostini',
      'forellen-spinat-kartoffel-piroggen-rote-bete-salat',
      'rind-kuerbis-reis-kohlrouladen-paprikasauce',
      'rote-linsen-karotten-dhokla-erbsen-chutney',
      'sardinen-fenchel-kartoffel-tortilla',
      'zucchini-lamm-bulgur-rollen-tomatensauce',
      'blumenkohl-linsen-socca-tomatenrelish',
      'rotbarsch-bohnen-rote-bete-paeckchen-dillkartoffeln',
      'puten-mangold-linsen-crepes-paprikasauce',
      'steckrueben-kichererbsen-roesti-apfelkraut',
      'forellen-linsen-wan-tan-pak-choi-bruehe',
      'kuerbis-bohnen-dinkel-calzone-mangold',
      'kichererbsen-fenchel-panisse-ratatouille',
      'kalb-lauch-dinkel-frikassee-erbsen',
      'pflaumen-quark-buchweizen-auflauf-mandeln',
      'kartoffel-linsen-bao-rotkohl',
      'muschel-bohnen-safranreis-fenchel',
      'mais-quark-nocken-pilzragout',
      'haehnchen-mais-dinkel-tamales-bohnen-salsa',
      'seehecht-kartoffel-mais-empanadas-bohnensalat',
      'lauch-kichererbsen-hafer-kloesse-paprikakraut',
      'miso-steckrueben-soba-edamame',
      'garnelen-linsen-polenta-baellchen-fenchel',
      'schweinefilet-kuerbis-dinkelknoedel-wirsing',
      'kichererbsen-spinat-msemen-karotten-linsen-salat',
      'makrelen-kartoffel-kedgeree-erbsen',
      'blumenkohl-kaese-graupen-kroketten-lauchcreme',
      'kartoffel-edamame-korokke-kohlsalat',
      'saibling-linsen-spinat-strudel-fenchel',
      'auberginen-hirse-involtini-bohnencreme',
      'rote-bete-linsen-dinkel-pasteten-meerrettichkraut',
      'seelachs-kichererbsen-baellchen-spinat-curry',
      'puten-bohnen-paprika-pide-joghurtsalat',
      'tempeh-kuerbis-reisnudel-laab-rotkohl',
      'spinat-bohnen-mais-tschadi-paprikajoghurt',
      'kabeljau-erbsen-graupen-pie-lauch',
      'tofu-rote-bete-buchweizen-nocken-meerrettichkraut',
      'herings-apfel-lauch-dinkelflammkuchen-bohnensalat',
      'pilz-linsen-kartoffel-zrazy-gurkenschmand',
      'erbsen-tofu-dinkel-siu-mai-pak-choi',
      'lachs-rote-bete-kartoffel-galette-bohnensalat',
      'rind-sellerie-hirse-manti-paprikajoghurt',
      'kartoffel-linsen-dinkelwaffeln-pilzragout',
      'garnelen-kuerbis-naturreis-congee-pak-choi',
      'puten-wirsing-hirse-kibbeh-rote-bete-joghurt',
      'lupinen-spinat-dinkel-pelmeni-paprikabruehe',
      'haehnchen-pastinaken-haferkuechle-lauchgemuese',
      'bohnen-kuerbis-teff-injera-mangold',
    ])
    expect(new Set(recipeImageManifest.map(({ dish }) => dish)).size).toBe(207)
    expect(recipeImageManifest.every(({ dish }) => dish.length >= 80)).toBe(true)
  })

  it('applies the single fixed Overlap style and explicit forbidden-content rules', () => {
    expect(OVERLAP_STYLE_PRESET).toContain('dark matte stone surface')
    expect(OVERLAP_STYLE_PRESET).toContain('warm natural side light')
    expect(OVERLAP_STYLE_PRESET).toContain('consistent 45-degree camera angle')
    expect(OVERLAP_STYLE_PRESET).toContain('realistic premium food styling')
    for (const recipe of recipeImageManifest) {
      const prompt = buildPrompt(recipe)
      expect(prompt).toContain(OVERLAP_STYLE_PRESET)
      expect(prompt).toContain(recipe.dish)
      expect(prompt).toContain('No text, no typography, no letters, no logo, no watermark, no people')
    }
  })
})

describe('format and response handling', () => {
  it('detects image formats from magic bytes rather than file names', () => {
    expect(detectImageFormat(jpeg)).toBe('jpeg')
    expect(detectImageFormat(Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe('png')
    expect(detectImageFormat(Uint8Array.from([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]))).toBe('webp')
    expect(detectImageFormat(Uint8Array.from([1, 2, 3]))).toBe('unknown')
  })

  it('accepts a raw JPEG API response', async () => {
    await expect(decodeImageResponse(response('image/jpeg', jpeg))).resolves.toEqual(jpeg)
  })

  it('decodes a JSON/base64 JPEG API response', async () => {
    const body = new TextEncoder().encode(JSON.stringify({ result: { image: Buffer.from(jpeg).toString('base64') } }))
    await expect(decodeImageResponse(response('application/json', body))).resolves.toEqual(jpeg)
  })

  it('rejects malformed base64 JSON image data', async () => {
    const body = new TextEncoder().encode(JSON.stringify({ result: { image: 'not valid *** base64' } }))
    await expect(decodeImageResponse(response('application/json', body))).rejects.toThrow('invalid base64')
  })

  it('sends only the model-supported prompt input and keeps credentials in the header', async () => {
    let request
    const fetchImpl = async (url, options) => {
      request = { url, options }
      return response('image/jpeg', jpeg)
    }
    await requestImage(recipeImageManifest[0], { accountId: 'account', apiToken: 'token' }, fetchImpl)
    expect(JSON.parse(request.options.body)).toEqual({ prompt: buildPrompt(recipeImageManifest[0]) })
    expect(request.options.headers.Authorization).toBe('Bearer token')
    expect(request.url).toContain('/accounts/account/ai/run/')
  })

  it('rejects API errors and non-JPEG payloads without persisting them', async () => {
    const apiError = new TextEncoder().encode(JSON.stringify({ errors: [{ message: 'rate limited' }] }))
    await expect(decodeImageResponse(response('application/json', apiError, false, 429))).rejects.toThrow('Cloudflare API request failed (429)')
    await expect(decodeImageResponse(response('image/png', Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))).rejects.toThrow('Expected JPEG bytes, received png')
  })
})

describe('safe, idempotent command selection', () => {
  it('uses only the fixed server-side credential file', () => {
    expect(ENV_PATH).toBe('/opt/data/.env')
  })

  it('parses force and a single recipe id', () => {
    expect(parseArgs(['--force', '--recipe', 'tacos'])).toEqual({ force: true, recipeId: 'tacos' })
    expect(() => parseArgs(['--recipe', 'missing'])).toThrow('Unknown recipe id: missing')
    expect(() => parseArgs(['--wat'])).toThrow('Unknown argument: --wat')
  })

  it('skips existing files by default and includes them with force', () => {
    const exists = (path) => path.endsWith('/tomatenpasta.jpg')
    expect(selectRecipes({ force: false, recipeId: undefined }, exists).some(({ id }) => id === 'tomatenpasta')).toBe(false)
    expect(selectRecipes({ force: true, recipeId: 'tomatenpasta' }, exists).map(({ id }) => id)).toEqual(['tomatenpasta'])
  })
})
