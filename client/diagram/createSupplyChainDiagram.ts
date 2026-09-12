import { createShapeId, Editor, TLShapePartial, toRichText } from 'tldraw'

type Color = 'black' | 'grey' | 'blue' | 'light-blue' | 'green' | 'light-green' | 'orange' | 'red' | 'light-red' | 'violet' | 'light-violet' | 'yellow'

const ids = {
	boundary: createShapeId('system-boundary'),
}

function text(
	id: string,
	x: number,
	y: number,
	label: string,
	w: number,
	size: 's' | 'm' | 'l' | 'xl' = 'm',
	color: Color = 'black'
): TLShapePartial {
	return {
		id: createShapeId(id),
		type: 'text',
		x,
		y,
		props: {
			w,
			size,
			color,
			font: 'sans',
			textAlign: 'start',
			autoSize: false,
			richText: toRichText(label),
		},
	}
}

function box(
	id: string,
	x: number,
	y: number,
	w: number,
	h: number,
	label: string,
	color: Color,
	fill: 'none' | 'semi' | 'solid' | 'pattern' = 'semi',
	size: 's' | 'm' | 'l' | 'xl' = 'm',
	dash: 'draw' | 'solid' | 'dashed' | 'dotted' = 'solid'
): TLShapePartial {
	return {
		id: createShapeId(id),
		type: 'geo',
		x,
		y,
		props: {
			geo: 'rectangle',
			w,
			h,
			color,
			labelColor: 'black',
			fill,
			size,
			dash,
			font: 'sans',
			align: 'middle',
			verticalAlign: 'middle',
			richText: toRichText(label),
		},
	}
}

function arrow(
	id: string,
	x: number,
	y: number,
	dx: number,
	dy: number,
	color: Color = 'grey',
	label = '',
	bend = 0,
	dash: 'draw' | 'solid' | 'dashed' | 'dotted' = 'solid'
): TLShapePartial {
	return {
		id: createShapeId(id),
		type: 'arrow',
		x,
		y,
		props: {
			kind: 'arc',
			start: { x: 0, y: 0 },
			end: { x: dx, y: dy },
			bend,
			color,
			labelColor: color,
			fill: 'none',
			dash,
			size: 'm',
			arrowheadStart: 'none',
			arrowheadEnd: 'arrow',
			font: 'sans',
			richText: toRichText(label),
		},
	}
}

/** Seed the academic case as an editable open-system map on a blank canvas. */
export function createSupplyChainDiagram(editor: Editor) {
	if (editor.getCurrentPageShapes().length > 0) return false

	const shapes: TLShapePartial[] = [
		// System boundary and phase areas are created first so they stay behind the flow.
		box('system-boundary', 80, 230, 2660, 1010, '', 'grey', 'none', 'm', 'dashed'),
		box('supply-area', 120, 350, 780, 700, '', 'blue', 'semi', 'm'),
		box('operation-area', 980, 350, 780, 700, '', 'orange', 'semi', 'm'),
		box('distribution-area', 1840, 350, 860, 700, '', 'green', 'semi', 'm'),

		text('title', 100, 55, 'SISTEMA ABIERTO · CADENA DE VALOR DE COMBUSTIBLES', 1800, 'xl'),
		text('subtitle', 100, 120, 'Flujo físico, información, control y retroalimentación — caso Paraguay', 1700, 'm', 'grey'),
		text('environment-label', 100, 190, 'AMBIENTE', 260, 'l', 'violet'),
		text('boundary-label', 2150, 245, 'LÍMITE DEL SISTEMA', 520, 's', 'grey'),

		box('regulators', 460, 170, 620, 105, 'MIC + INTN\nNormativa y control técnico', 'violet', 'semi'),
		box('market', 1180, 170, 620, 105, 'Mercado y demanda\nlocal + exportación', 'violet', 'semi'),
		box('suppliers', 1900, 170, 620, 105, 'Proveedores externos\nrefinerías · navieras · insumos', 'violet', 'semi'),

		text('supply-title', 155, 375, '1 · CADENA DE ABASTECIMIENTO', 690, 'l', 'blue'),
		text('supply-range', 155, 425, 'Desde exploración/extracción hasta recepción en la terminal', 690, 's', 'blue'),
		text('operation-title', 1015, 375, '2 · OPERACIÓN / ALMACENAMIENTO', 700, 'l', 'orange'),
		text('operation-range', 1015, 425, 'Desde recepción hasta producto aprobado y almacenado', 700, 's', 'orange'),
		text('distribution-title', 1875, 375, '3 · CADENA DE DISTRIBUCIÓN', 760, 'l', 'green'),
		text('distribution-range', 1875, 425, 'Desde despacho en terminal hasta cliente final', 760, 's', 'green'),

		// Physical flow arrows (placed before nodes so nodes remain visually dominant).
		arrow('a-extract-refine', 350, 590, 0, 105, 'blue'),
		arrow('a-refine-ocean', 350, 800, 0, 105, 'blue'),
		arrow('a-ocean-terminal', 570, 950, 565, -360, 'blue', 'alije + navegación fluvial', -90),
		arrow('a-storage-process', 1370, 650, 0, 80, 'orange'),
		arrow('a-process-quality', 1370, 830, 0, 80, 'orange'),
		arrow('a-quality-output', 1600, 950, 485, -360, 'orange', 'liberación de lote', -80),
		arrow('a-dispatch-channels', 2270, 650, 0, 90, 'green'),
		arrow('a-channels-user', 2270, 855, 0, 80, 'green'),
		arrow('a-reg-control', 760, 275, 610, 455, 'violet', 'control', 70, 'dashed'),
		arrow('a-demand-feedback', 2270, 1010, -1900, 230, 'red', 'RETROALIMENTACIÓN · ventas, inventario, calidad y demanda', 170, 'dashed'),

		box('extraction', 200, 500, 300, 90, 'Exploración, perforación\ny extracción de crudo', 'blue'),
		box('refinery', 200, 695, 300, 105, 'Refinación\ngasoil · nafta · GLP\npetroquímicos', 'blue'),
		box('ocean-logistics', 200, 905, 300, 105, 'Naviera de ultramar\n→ alije en Uruguay', 'blue'),
		box('river-logistics', 585, 805, 265, 105, 'Naviera fluvial\n→ San Antonio', 'blue'),
		box('supply-inputs', 585, 500, 265, 180, 'ENTRADAS\nGasoil + nafta\nBiodiesel + alcohol\nAditivos\nInformación de demanda', 'light-blue', 'solid'),

		box('terminal-storage', 1215, 530, 310, 120, 'Recepción y almacenamiento\nTerminal portuaria\nSan Antonio', 'orange'),
		box('blend', 1215, 730, 310, 100, 'TRANSFORMACIÓN\nBlending + aditivado', 'orange', 'solid'),
		box('quality', 1215, 910, 310, 100, 'Control de calidad\ny fórmula del emblema', 'orange'),
		box('products', 1540, 530, 180, 210, 'PRODUCTOS\nGasoil I / III\nNafta RON\n85 · 90 · 95 · 97', 'yellow', 'solid'),

		box('road-transport', 2115, 530, 310, 120, 'Despacho y transporte\nterrestre en cisternas', 'green'),
		box('channels', 2020, 740, 500, 115, 'CANALES\nEstaciones de servicio · industrias\nexportación mayorista a Bolivia', 'green', 'solid'),
		box('consumer', 2115, 935, 310, 80, 'Usuario final minorista', 'green'),
		box('outputs', 2480, 530, 175, 240, 'SALIDAS\nCombustible disponible\nVentas B2B / B2C\nExportaciones\nDatos de consumo', 'light-green', 'solid'),

		box('traceability', 885, 1300, 1050, 170, 'PROPUESTA DE TRAZABILIDAD POR LOTE\nPY-[EMB]-[PROD]-[RON/TIPO]-[AAAAMMDD]-[TER]-[TK]-[LOTE]\nEjemplo: PY-PET-NAF-R95-20260911-SAN-T12-L0042', 'black', 'none', 'm', 'solid'),
		box('trace-events', 1990, 1300, 710, 170, 'Registrar en cada hito:\nproveedor · buque/barcaza · alije · tanque\nmezcla/aditivos · ensayo QC · cisterna · destino', 'grey', 'none'),
		text('legend', 100, 1505, 'Azul: abastecimiento   ·   Naranja: operación   ·   Verde: distribución   ·   Violeta: ambiente/control   ·   Rojo: retroalimentación', 2200, 's', 'grey'),
	]

	editor.run(() => {
		editor.createShapes(shapes)
		editor.sendToBack([ids.boundary])
	})
	editor.zoomToFit({ animation: { duration: 500 } })
	return true
}

