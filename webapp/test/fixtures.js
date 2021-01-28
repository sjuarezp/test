var data1 = [
    {lat: 0, lng: 0, x: 166021.443, y: 0, zone: 31, band: 'N', southHemi: false, margin: 0.001},
    {lat: 0, lng: 3, x: 500000, y: 0, zone: 31, band: 'N', southHemi: false, margin: 0.001},
     
];

var formats = [
    {msg: 'Default values',
        x: 0, y: 1, zone: 2, band: 'C', southHemi: true,
        txt: '0.0, 1.0, 2C, WGS84'},
    {msg: 'The same as default values',
        x: 0, y: 1, zone: 2, band: 'C', southHemi: true,
        format: '{x}{sep} {y}{sep} {zone}{band}{sep} {datum}', txt: '0.0, 1.0, 2C, WGS84'},
    {msg: 'Some options and format',
        x: 0, y: 1, zone: 2, band: 'C', southHemi: true,
        decimals: 0, sep: ';', format: '{y}{sep} {x}{sep} {zone} {band} {hemi}',
        txt: '1; 0; 2 C South'},
    {msg: 'Different south',
        x: 0, y: 1, zone: 2, band: 'C', southHemi: true,
        north: 'norte', south: 'sur', format: '{x} {y} {zone}{band} {hemi}',
        txt: '0.0 1.0 2C sur'},
    {msg: 'Different north',
        x: 0, y: 1, zone: 2, band: 'N', southHemi: false,
        north: 'norte', south: 'sur', format: '{x} {y} {zone}{band} {hemi}',
        txt: '0.0 1.0 2N norte'},
    {msg: 'UTF-8 on north attr',
        x: 0, y: 1, zone: 2, band: 'N', southHemi: false,
        north: 'ñorte', south: 'sur', format: '{x} {y} {zone}{band} {hemi}',
        txt: '0.0 1.0 2N ñorte'},
    {msg: '- on south',
        x: 0, y: 1, zone: 2, southHemi: true,
        north: '+', south: '-', format: '{x} {y} {hemi}{zone}',
        txt: '0.0 1.0 -2'},
    {msg: '+ on north',
        x: 0, y: 1, zone: 2, southHemi: false,
        north: '+', south: '-', format: '{x} {y} {hemi}{zone}',
        txt: '0.0 1.0 +2'},
];

var defOptions = [
    {msg: 'Default values',
        x: 0, y: 1, zone: 2, band: 'C', southHemi: true,
        txt: '0..1',
        defTxt: '',
        defO: function() {return {format: '{x}..{y}', decimals: 0};}},
    {msg: 'Some options and format',
        x: 0, y: 1, zone: 2, band: 'C', southHemi: true,
        format: '{y}{sep} {x}{sep} {zone} {band} {hemi}',
        txt: '1.00| 0.00| 2 C South',
        defTxt: '1.0, 0.0, 2 C South',
        defO: function() {return {decimals: 2, sep: '|'};}},
    {msg: 'Object',
        x: 0, y: 1, zone: 2, band: 'C', southHemi: true,
        txt: '0..1',
        defTxt: '',
        defO: {format: '{x}..{y}', decimals: 0}},
];
