import { createShapeId, Editor, TLShapePartial, toRichText } from 'tldraw'
import legacySupplyChainSeed from './legacySupplyChainSeed'
import detailedSupplyChainSeedV1 from './detailedSupplyChainSeedV1'

type Color = 'black' | 'grey' | 'blue' | 'orange' | 'green' | 'red'
type Size = 's' | 'm' | 'l' | 'xl'

function text(id: string, x: number, y: number, label: string, w: number, size: Size = 'm', color: Color = 'black'): TLShapePartial {
	return { id: createShapeId(id), type: 'text', x, y, props: { w, size, color, font: 'sans', textAlign: 'start', autoSize: false, richText: toRichText(label) } }
}

function box(id: string, x: number, y: number, w: number, h: number, label: string, color: Color, fill: 'none' | 'semi' | 'solid' = 'semi', dash: 'solid' | 'dashed' = 'solid'): TLShapePartial {
	return { id: createShapeId(id), type: 'geo', x, y, props: { geo: 'rectangle', w, h, color, labelColor: 'black', fill, size: 'l', dash, font: 'sans', align: 'middle', verticalAlign: 'middle', richText: toRichText(label) } }
}

function arrow(id: string, x: number, y: number, dx: number, dy: number, color: Color, label = '', dash: 'solid' | 'dashed' = 'solid', head: 'none' | 'arrow' = 'arrow'): TLShapePartial {
	return { id: createShapeId(id), type: 'arrow', x, y, props: { kind: 'arc', start: { x: 0, y: 0 }, end: { x: dx, y: dy }, bend: 0, color, labelColor: color, fill: 'none', dash, size: 'm', arrowheadStart: 'none', arrowheadEnd: head, font: 'sans', richText: toRichText(label) } }
}

/** Native arrow segments keep long flows in the open lanes between cards. */
function route(id: string, points: [number, number][], color: Color, dash: 'solid' | 'dashed' = 'solid'): TLShapePartial[] {
	return points.slice(1).map(([x, y], index) => {
		const [fromX, fromY] = points[index]
		return arrow(`${id}-${index + 1}`, fromX, fromY, x - fromX, y - fromY, color, '', dash, index === points.length - 2 ? 'arrow' : 'none')
	})
}

type SeedSignature = { id: string; type: string; x: number; y: number; props: Record<string, unknown> }

function isUnmodifiedSeed(editor: Editor, seed: readonly SeedSignature[]) {
	const current = editor.getCurrentPageShapes()
	if (current.length !== seed.length) return false
	const byId = new Map(current.map((shape) => [shape.id, shape]))
	return seed.every((expected) => {
		const actual = byId.get(expected.id as ReturnType<typeof createShapeId>)
		if (!actual || actual.type !== expected.type || actual.x !== expected.x || actual.y !== expected.y) return false
		return Object.entries(expected.props).every(([key, value]) => {
			const wanted = key === 'richText' ? toRichText(value as string) : value
			return JSON.stringify((actual.props as unknown as Record<string, unknown>)[key]) === JSON.stringify(wanted)
		})
	})
}

/** Case facts come from pages 1–2; traceability and feedback are labeled proposals. */
export function createSupplyChainDiagram(editor: Editor) {
	const existing = editor.getCurrentPageShapes()
	const upgradeSeed = existing.length > 0 && (
		isUnmodifiedSeed(editor, legacySupplyChainSeed as readonly SeedSignature[]) ||
		isUnmodifiedSeed(editor, detailedSupplyChainSeedV1 as readonly SeedSignature[])
	)
	if (existing.length > 0 && !upgradeSeed) return false

	const shapes: TLShapePartial[] = [
		box('system-boundary', 70, 350, 3650, 1270, '', 'grey', 'none', 'dashed'),
		box('supply-area', 110, 390, 1120, 1190, '', 'blue'),
		box('operation-area', 1300, 390, 1120, 1190, '', 'orange'),
		box('distribution-area', 2490, 390, 1190, 1190, '', 'green'),
		text('title', 100, 45, 'CADENA DE VALOR DE COMBUSTIBLES · SISTEMA ABIERTO', 3150, 'xl'),
		text('subtitle', 100, 115, 'Caso académico: importación, formulación y distribución en Paraguay', 2800, 'm', 'grey'),
		text('environment', 100, 185, 'AMBIENTE EXTERNO', 550, 'l', 'grey'),
		box('market', 590, 175, 570, 110, 'Demanda local y boliviana\n23 emblemas; 13 importan', 'grey'),
		box('tlp', 1220, 175, 560, 110, 'TLP importa y vende\na emblemas mayoristas', 'grey'),
		box('regulators', 1840, 175, 570, 110, 'MIC + INTN\nRegulación y control técnico', 'grey'),
		box('external-inputs', 2470, 175, 680, 110, 'Plantas nacionales: biodiesel / alcohol\nBrasil y Argentina: aditivos', 'grey'),
		text('boundary-label', 3040, 355, 'LÍMITE DEL SISTEMA ANALIZADO', 620, 's', 'grey'),
		text('supply-title', 145, 420, '1  ABASTECIMIENTO', 960, 'l', 'blue'),
		text('supply-range', 145, 465, 'Exploración y extracción → recepción en San Antonio', 990, 'm', 'blue'),
		text('supply-parameter', 145, 1500, 'ENTRADAS: crudo, gasoil y nafta importados; pedido de compra', 1000, 'm', 'blue'),
		text('operation-title', 1335, 420, '2  OPERACIÓN / ALMACENAMIENTO', 1020, 'l', 'orange'),
		text('operation-range', 1335, 465, 'Recepción → mezcla, aditivado y control de calidad', 1000, 'm', 'orange'),
		text('operation-parameter', 1335, 1530, 'TRANSFORMACIÓN: insumos + fórmula → grado final aprobado', 1020, 'm', 'orange'),
		text('distribution-title', 2525, 420, '3  DISTRIBUCIÓN', 1050, 'l', 'green'),
		text('distribution-range', 2525, 465, 'Venta y despacho → destinatario / usuario final', 1070, 'm', 'green'),
		text('distribution-parameter', 2525, 1500, 'SALIDAS: combustible entregado, ventas y exportaciones', 1070, 'm', 'green'),

		box('extract', 175, 535, 420, 105, 'Multinacionales\nexploración · perforación · extracción', 'blue'),
		box('crude-transport', 175, 685, 420, 100, 'Traslado de crudo\noleoducto · gasoducto · buque', 'blue'),
		box('refine', 175, 830, 420, 125, 'Refinerías especializadas\ngasoil · nafta · GLP · petroquímicos', 'blue'),
		box('negotiate', 695, 830, 455, 125, 'Emblemas importadores\nnegocian y compran gasoil / nafta', 'blue'),
		box('ultramar', 695, 1040, 455, 100, 'Naviera de ultramar\n→ Río de la Plata, puerto uruguayo', 'blue'),
		box('alije', 695, 1200, 455, 100, 'Alije en Uruguay\nbuque → barcaza local', 'blue'),
		box('fluvial', 695, 1360, 455, 100, 'Naviera fluvial paraguaya\n→ terminal en San Antonio', 'blue'),
		arrow('s1', 385, 640, 0, 45, 'blue'),
		arrow('s2', 385, 785, 0, 45, 'blue'),
		arrow('s3', 595, 892, 100, 0, 'blue'),
		arrow('s4', 925, 955, 0, 85, 'blue'),
		arrow('s5', 925, 1140, 0, 60, 'blue'),
		arrow('s6', 925, 1300, 0, 60, 'blue'),

		box('receive', 1635, 535, 450, 100, 'Terminal portuaria · San Antonio\nrecepción y almacenaje', 'orange'),
		box('gasoil-blend', 1360, 750, 440, 120, 'GASOIL\nblending con biodiesel nacional', 'orange'),
		box('nafta-blend', 1920, 750, 440, 120, 'NAFTA\nblending con alcohol nacional', 'orange'),
		box('gasoil-additive', 1360, 945, 440, 110, 'Aditivado de gasoil\nfórmula correspondiente', 'orange'),
		box('nafta-additive', 1920, 945, 440, 110, 'Aditivado de nafta\nfórmula establecida', 'orange'),
		box('gasoil-qc', 1360, 1130, 440, 110, 'Control de calidad\naplicación de fórmula del emblema', 'orange'),
		box('nafta-qc', 1920, 1130, 440, 110, 'Control de calidad\naplicación de fórmula del emblema', 'orange'),
		box('gasoil-result', 1360, 1330, 440, 100, 'Producto final\nGasoil Tipo I / Tipo III', 'orange', 'solid'),
		box('nafta-result', 1920, 1330, 440, 100, 'Producto final\nNafta RON 85 / 90 / 95 / 97', 'orange', 'solid'),
		...route('supply-operation', [[1150, 1410], [1270, 1410], [1270, 680], [1570, 680], [1570, 585], [1635, 585]], 'blue'),
		arrow('o1-g', 1770, 635, -190, 115, 'orange'),
		arrow('o1-n', 1950, 635, 190, 115, 'orange'),
		arrow('o2-g', 1580, 870, 0, 75, 'orange'),
		arrow('o2-n', 2140, 870, 0, 75, 'orange'),
		arrow('o3-g', 1580, 1055, 0, 75, 'orange'),
		arrow('o3-n', 2140, 1055, 0, 75, 'orange'),
		arrow('o4-g', 1580, 1240, 0, 90, 'orange'),
		arrow('o4-n', 2140, 1240, 0, 90, 'orange'),
		...route('input-biodiesel', [[2520, 285], [2435, 285], [2435, 660], [1580, 660], [1580, 750]], 'grey', 'dashed'),
		...route('input-alcohol', [[2590, 285], [2460, 285], [2460, 700], [2140, 700], [2140, 750]], 'grey', 'dashed'),
		text('additive-note', 1370, 1480, 'Aditivos importados principalmente de Brasil y Argentina', 980, 's', 'grey'),

		box('sale', 2815, 535, 530, 110, 'Emblema distribuidor\nventa tras control de calidad', 'green'),
		box('carrier', 2815, 715, 530, 125, 'Transportista terrestre especializado\ncisterna ploteada con logo del emblema', 'green'),
		box('stations', 2540, 965, 325, 115, 'Operadoras de estaciones\npropias o franquiciadas', 'green'),
		box('industry', 2930, 965, 325, 115, 'Venta mayorista\nempresas e industrias', 'green'),
		box('bolivia', 3320, 965, 325, 115, 'Exportación mayorista\nempresas bolivianas', 'green'),
		box('consumer', 2540, 1230, 325, 105, 'Usuario final minorista\ncompra en estación', 'green', 'solid'),
		box('business-output', 2930, 1230, 325, 105, 'Entrega B2B local\ncombustible a industria', 'green', 'solid'),
		box('export-output', 3320, 1230, 325, 105, 'Entrega terrestre\nmercado boliviano', 'green', 'solid'),
		...route('gasoil-to-sale', [[1800, 1380], [1870, 1380], [1870, 1460], [2510, 1460], [2510, 665], [2750, 665], [2750, 570], [2815, 570]], 'orange'),
		...route('nafta-to-sale', [[2360, 1380], [2440, 1380], [2440, 690], [2770, 690], [2770, 610], [2815, 610]], 'orange'),
		arrow('d1', 3080, 645, 0, 70, 'green'),
		arrow('d2-stations', 2930, 840, -230, 125, 'green'),
		arrow('d2-industry', 3080, 840, 0, 125, 'green'),
		arrow('d2-bolivia', 3230, 840, 250, 125, 'green'),
		arrow('d3-stations', 2700, 1080, 0, 150, 'green'),
		arrow('d3-industry', 3090, 1080, 0, 150, 'green'),
		arrow('d3-bolivia', 3480, 1080, 0, 150, 'green'),

		arrow('purchase-information', 695, 875, -100, 0, 'grey', '', 'dashed'),
		...route('tlp-wholesale', [[1220, 230], [1200, 230], [1200, 320], [1240, 320], [1240, 895], [1150, 895]], 'grey', 'dashed'),
		...route('demand-information', [[900, 285], [900, 335], [1190, 335], [1190, 770], [920, 770], [920, 830]], 'grey', 'dashed'),
		...route('regulatory-control', [[2410, 230], [2425, 230], [2425, 320], [2405, 320], [2405, 1185], [2360, 1185]], 'red', 'dashed'),
		...route('qc-feedback-gasoil', [[1360, 1185], [1325, 1185], [1325, 910], [1580, 910], [1580, 945]], 'red', 'dashed'),
		...route('qc-feedback-nafta', [[2360, 1185], [2380, 1185], [2380, 910], [2140, 910], [2140, 945]], 'red', 'dashed'),
		...route('market-feedback', [[3645, 1280], [3695, 1280], [3695, 1645], [1180, 1645], [1180, 930], [1150, 930]], 'red', 'dashed'),
		text('flow-notes', 1350, 1600, 'Gris: pedido, demanda e insumos   ·   Rojo: MIC/INTN, ajuste por calidad y retorno de ventas', 2100, 's', 'grey'),

		box('trace-code', 105, 1700, 1700, 230, 'PROPUESTA · CÓDIGO DE LOTE\n[EMB]-[PROD]-[TIPO/RON]-[FECHA]-[TER]-[TQ]-[SEC]\nEjemplo ilustrativo: EMB-NAF-R95-AAAAMMDD-SAN-T12-0042', 'grey', 'none'),
		box('trace-events', 1880, 1700, 1780, 230, 'PROPUESTA · REGISTRO VINCULADO\nLote padre/refinería · buque · alije/barcaza · recepción/tanque\nInsumos y fórmula · ensayo de calidad · cisterna · cliente/destino', 'grey', 'none'),
		text('legend', 100, 1970, 'Sólido y color de cadena: flujo físico   ·   Gris discontinuo: información/insumos   ·   Rojo discontinuo: control y retroalimentación', 3450, 's', 'grey'),
		text('case-note', 100, 2020, 'Hechos del caso: pasos, actores y productos. Propuestas analíticas: codificación, registro de eventos y bucles de retroalimentación.', 3500, 's', 'grey'),
	]

	// Phase backgrounds, connectors, cards, then standalone text. Cards mask any
	// unavoidable connector crossings, so no arrow is drawn over a card label.
	const orderedShapes = [
		...shapes.slice(0, 4),
		...shapes.filter((shape) => shape.type === 'arrow'),
		...shapes.slice(4).filter((shape) => shape.type === 'geo'),
		...shapes.filter((shape) => shape.type === 'text'),
	]
	editor.run(() => {
		if (upgradeSeed) editor.deleteShapes(existing.map((shape) => shape.id))
		editor.createShapes(orderedShapes)
		editor.sendToBack([createShapeId('system-boundary')])
	})
	editor.zoomToFit({ animation: { duration: 500 } })
	return true
}
