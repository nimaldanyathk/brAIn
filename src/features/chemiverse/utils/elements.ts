export interface ElementData {
    number: number;
    symbol: string;
    name: string;
    mass: number;
    category: string;
    electron_configuration: string;
    shells: number[];
    cpkHex: string;
    atomic_radius?: number; // pm
    electronegativity?: number; // Pauling
    group: number;
    period: number;
    block: 's' | 'p' | 'd' | 'f';
}

// Helper to determine position and block
const getPosition = (z: number): { group: number, period: number, block: 's' | 'p' | 'd' | 'f' } => {
    if (z === 1) return { group: 1, period: 1, block: 's' };
    if (z === 2) return { group: 18, period: 1, block: 's' };
    
    if (z >= 3 && z <= 4) return { group: z - 2, period: 2, block: 's' };
    if (z >= 5 && z <= 10) return { group: z + 8, period: 2, block: 'p' };

    if (z >= 11 && z <= 12) return { group: z - 10, period: 3, block: 's' };
    if (z >= 13 && z <= 18) return { group: z, period: 3, block: 'p' };

    if (z >= 19 && z <= 20) return { group: z - 18, period: 4, block: 's' };
    if (z >= 21 && z <= 30) return { group: z - 18, period: 4, block: 'd' };
    if (z >= 31 && z <= 36) return { group: z - 18, period: 4, block: 'p' };

    if (z >= 37 && z <= 38) return { group: z - 36, period: 5, block: 's' };
    if (z >= 39 && z <= 48) return { group: z - 36, period: 5, block: 'd' };
    if (z >= 49 && z <= 54) return { group: z - 36, period: 5, block: 'p' };

    if (z >= 55 && z <= 56) return { group: z - 54, period: 6, block: 's' };
    if (z >= 57 && z <= 71) return { group: z - 54, period: 6, block: 'f' };
    if (z >= 72 && z <= 80) return { group: z - 68, period: 6, block: 'd' };
    if (z >= 81 && z <= 86) return { group: z - 68, period: 6, block: 'p' };

    if (z >= 87 && z <= 88) return { group: z - 86, period: 7, block: 's' };
    if (z >= 89 && z <= 103) return { group: z - 86, period: 7, block: 'f' };
    if (z >= 104 && z <= 112) return { group: z - 100, period: 7, block: 'd' };
    if (z >= 113 && z <= 118) return { group: z - 100, period: 7, block: 'p' };

    return { group: 1, period: 1, block: 's' };
};

// Full list of 118 elements
const RAW_DATA = [
  ["H","Hydrogen",1.008,"diatomic nonmetal","1s¹",[1],"ffffff",53,2.2],
  ["He","Helium",4.0026,"noble gas","1s²",[2],"d9ffff",31,null],
  ["Li","Lithium",6.94,"alkali metal","[He] 2s¹",[2,1],"cc80ff",167,0.98],
  ["Be","Beryllium",9.0122,"alkaline earth metal","[He] 2s²",[2,2],"c2ff00",112,1.57],
  ["B","Boron",10.81,"metalloid","[He] 2s² 2p¹",[2,3],"ffb5b5",87,2.04],
  ["C","Carbon",12.011,"polyatomic nonmetal","[He] 2s² 2p²",[2,4],"909090",67,2.55],
  ["N","Nitrogen",14.007,"diatomic nonmetal","[He] 2s² 2p³",[2,5],"3050f8",56,3.04],
  ["O","Oxygen",15.999,"diatomic nonmetal","[He] 2s² 2p⁴",[2,6],"ff0d0d",48,3.44],
  ["F","Fluorine",18.998,"diatomic nonmetal","[He] 2s² 2p⁵",[2,7],"90e050",42,3.98],
  ["Ne","Neon",20.180,"noble gas","[He] 2s² 2p⁶",[2,8],"b3e3f5",38,null],
  ["Na","Sodium",22.990,"alkali metal","[Ne] 3s¹",[2,8,1],"ab5cf2",190,0.93],
  ["Mg","Magnesium",24.305,"alkaline earth metal","[Ne] 3s²",[2,8,2],"8aff00",145,1.31],
  ["Al","Aluminium",26.982,"post-transition metal","[Ne] 3s² 3p¹",[2,8,3],"bfa6a6",118,1.61],
  ["Si","Silicon",28.085,"metalloid","[Ne] 3s² 3p²",[2,8,4],"f0c8a0",111,1.9],
  ["P","Phosphorus",30.974,"polyatomic nonmetal","[Ne] 3s² 3p³",[2,8,5],"ff8000",98,2.19],
  ["S","Sulfur",32.06,"polyatomic nonmetal","[Ne] 3s² 3p⁴",[2,8,6],"ffff30",88,2.58],
  ["Cl","Chlorine",35.45,"diatomic nonmetal","[Ne] 3s² 3p⁵",[2,8,7],"1ff01f",79,3.16],
  ["Ar","Argon",39.948,"noble gas","[Ne] 3s² 3p⁶",[2,8,8],"80d1e3",71,null],
  ["K","Potassium",39.098,"alkali metal","[Ar] 4s¹",[2,8,8,1],"8f40d4",243,0.82],
  ["Ca","Calcium",40.078,"alkaline earth metal","[Ar] 4s²",[2,8,8,2],"3dff00",194,1],
  ["Sc","Scandium",44.956,"transition metal","[Ar] 3d¹ 4s²",[2,8,9,2],"e6e6e6",184,1.36],
  ["Ti","Titanium",47.867,"transition metal","[Ar] 3d² 4s²",[2,8,10,2],"bfc2c7",176,1.54],
  ["V","Vanadium",50.942,"transition metal","[Ar] 3d³ 4s²",[2,8,11,2],"a6a6ab",171,1.63],
  ["Cr","Chromium",51.996,"transition metal","[Ar] 3d⁵ 4s¹",[2,8,13,1],"8a99c7",166,1.66],
  ["Mn","Manganese",54.938,"transition metal","[Ar] 3d⁵ 4s²",[2,8,13,2],"9c7ac7",161,1.55],
  ["Fe","Iron",55.845,"transition metal","[Ar] 3d⁶ 4s²",[2,8,14,2],"e06633",156,1.83],
  ["Co","Cobalt",58.933,"transition metal","[Ar] 3d⁷ 4s²",[2,8,15,2],"f090a0",152,1.88],
  ["Ni","Nickel",58.693,"transition metal","[Ar] 3d⁸ 4s²",[2,8,16,2],"50d050",149,1.91],
  ["Cu","Copper",63.546,"transition metal","[Ar] 3d¹⁰ 4s¹",[2,8,18,1],"c88033",145,1.9],
  ["Zn","Zinc",65.38,"transition metal","[Ar] 3d¹⁰ 4s²",[2,8,18,2],"7d80b0",142,1.65],
  ["Ga","Gallium",69.723,"post-transition metal","[Ar] 3d¹⁰ 4s² 4p¹",[2,8,18,3],"c28f8f",136,1.81],
  ["Ge","Germanium",72.63,"metalloid","[Ar] 3d¹⁰ 4s² 4p²",[2,8,18,4],"668f8f",125,2.01],
  ["As","Arsenic",74.922,"metalloid","[Ar] 3d¹⁰ 4s² 4p³",[2,8,18,5],"bd80e3",114,2.18],
  ["Se","Selenium",78.96,"polyatomic nonmetal","[Ar] 3d¹⁰ 4s² 4p⁴",[2,8,18,6],"ffa100",103,2.55],
  ["Br","Bromine",79.904,"diatomic nonmetal","[Ar] 3d¹⁰ 4s² 4p⁵",[2,8,18,7],"a62929",94,2.96],
  ["Kr","Krypton",83.798,"noble gas","[Ar] 3d¹⁰ 4s² 4p⁶",[2,8,18,8],"5cb8d1",88,3],
  ["Rb","Rubidium",85.468,"alkali metal","[Kr] 5s¹",[2,8,18,8,1],"702eb0",265,0.82],
  ["Sr","Strontium",87.62,"alkaline earth metal","[Kr] 5s²",[2,8,18,8,2],"00ff00",219,0.95],
  ["Y","Yttrium",88.906,"transition metal","[Kr] 4d¹ 5s²",[2,8,18,9,2],"94ffff",212,1.22],
  ["Zr","Zirconium",91.224,"transition metal","[Kr] 4d² 5s²",[2,8,18,10,2],"94e0e0",206,1.33],
  ["Nb","Niobium",92.906,"transition metal","[Kr] 4d⁴ 5s¹",[2,8,18,12,1],"73c2c9",198,1.6],
  ["Mo","Molybdenum",95.95,"transition metal","[Kr] 4d⁵ 5s¹",[2,8,18,13,1],"54b5b5",190,2.16],
  ["Tc","Technetium",98,"transition metal","[Kr] 4d⁵ 5s²",[2,8,18,13,2],"3b9e9e",183,1.9],
  ["Ru","Ruthenium",101.07,"transition metal","[Kr] 4d⁷ 5s¹",[2,8,18,15,1],"248f8f",178,2.2],
  ["Rh","Rhodium",102.91,"transition metal","[Kr] 4d⁸ 5s¹",[2,8,18,16,1],"0a7d8c",173,2.28],
  ["Pd","Palladium",106.42,"transition metal","[Kr] 4d¹⁰",[2,8,18,18],"006985",169,2.2],
  ["Ag","Silver",107.87,"transition metal","[Kr] 4d¹⁰ 5s¹",[2,8,18,18,1],"c0c0c0",165,1.93],
  ["Cd","Cadmium",112.41,"transition metal","[Kr] 4d¹⁰ 5s²",[2,8,18,18,2],"ffd98f",161,1.69],
  ["In","Indium",114.82,"post-transition metal","[Kr] 4d¹⁰ 5s² 5p¹",[2,8,18,18,3],"a67573",156,1.78],
  ["Sn","Tin",118.71,"post-transition metal","[Kr] 4d¹⁰ 5s² 5p²",[2,8,18,18,4],"668080",145,1.96],
  ["Sb","Antimony",121.76,"metalloid","[Kr] 4d¹⁰ 5s² 5p³",[2,8,18,18,5],"9e63b5",133,2.05],
  ["Te","Tellurium",127.60,"metalloid","[Kr] 4d¹⁰ 5s² 5p⁴",[2,8,18,18,6],"d47a00",123,2.1],
  ["I","Iodine",126.90,"diatomic nonmetal","[Kr] 4d¹⁰ 5s² 5p⁵",[2,8,18,18,7],"940094",115,2.66],
  ["Xe","Xenon",131.29,"noble gas","[Kr] 4d¹⁰ 5s² 5p⁶",[2,8,18,18,8],"429eb0",108,2.6],
  ["Cs","Caesium",132.91,"alkali metal","[Xe] 6s¹",[2,8,18,18,8,1],"57178f",298,0.79],
  ["Ba","Barium",137.33,"alkaline earth metal","[Xe] 6s²",[2,8,18,18,8,2],"00c900",253,0.89],
  ["La","Lanthanum",138.91,"lanthanide","[Xe] 5d¹ 6s²",[2,8,18,18,9,2],"70d4ff",195,1.1],
  ["Ce","Cerium",140.12,"lanthanide","[Xe] 4f¹ 5d¹ 6s²",[2,8,18,19,9,2],"ffffc7",185,1.12],
  ["Pr","Praseodymium",140.91,"lanthanide","[Xe] 4f³ 6s²",[2,8,18,21,8,2],"d9ffc7",247,1.13],
  ["Nd","Neodymium",144.24,"lanthanide","[Xe] 4f⁴ 6s²",[2,8,18,22,8,2],"c7ffc7",206,1.14],
  ["Pm","Promethium",145,"lanthanide","[Xe] 4f⁵ 6s²",[2,8,18,23,8,2],"a3ffc7",205,1.13],
  ["Sm","Samarium",150.36,"lanthanide","[Xe] 4f⁶ 6s²",[2,8,18,24,8,2],"8fffc7",238,1.17],
  ["Eu","Europium",151.96,"lanthanide","[Xe] 4f⁷ 6s²",[2,8,18,25,8,2],"61ffc7",231,1.2],
  ["Gd","Gadolinium",157.25,"lanthanide","[Xe] 4f⁷ 5d¹ 6s²",[2,8,18,25,9,2],"45ffc7",233,1.2],
  ["Tb","Terbium",158.93,"lanthanide","[Xe] 4f⁹ 6s²",[2,8,18,27,8,2],"30ffc7",225,1.2],
  ["Dy","Dysprosium",162.50,"lanthanide","[Xe] 4f¹⁰ 6s²",[2,8,18,28,8,2],"1fffc7",228,1.22],
  ["Ho","Holmium",164.93,"lanthanide","[Xe] 4f¹¹ 6s²",[2,8,18,29,8,2],"00ff9c",226,1.23],
  ["Er","Erbium",167.26,"lanthanide","[Xe] 4f¹² 6s²",[2,8,18,30,8,2],"00e675",226,1.24],
  ["Tm","Thulium",168.93,"lanthanide","[Xe] 4f¹³ 6s²",[2,8,18,31,8,2],"00d452",222,1.25],
  ["Yb","Ytterbium",173.05,"lanthanide","[Xe] 4f¹⁴ 6s²",[2,8,18,32,8,2],"00bf38",222,1.1],
  ["Lu","Lutetium",174.97,"lanthanide","[Xe] 4f¹⁴ 5d¹ 6s²",[2,8,18,32,9,2],"00ab24",217,1.27],
  ["Hf","Hafnium",178.49,"transition metal","[Xe] 4f¹⁴ 5d² 6s²",[2,8,18,32,10,2],"4dc2ff",208,1.3],
  ["Ta","Tantalum",180.95,"transition metal","[Xe] 4f¹⁴ 5d³ 6s²",[2,8,18,32,11,2],"4da6ff",200,1.5],
  ["W","Tungsten",183.84,"transition metal","[Xe] 4f¹⁴ 5d⁴ 6s²",[2,8,18,32,12,2],"2194d6",193,2.36],
  ["Re","Rhenium",186.21,"transition metal","[Xe] 4f¹⁴ 5d⁵ 6s²",[2,8,18,32,13,2],"267dab",188,1.9],
  ["Os","Osmium",190.23,"transition metal","[Xe] 4f¹⁴ 5d⁶ 6s²",[2,8,18,32,14,2],"266696",185,2.2],
  ["Ir","Iridium",192.22,"transition metal","[Xe] 4f¹⁴ 5d⁷ 6s²",[2,8,18,32,15,2],"175487",180,2.2],
  ["Pt","Platinum",195.08,"transition metal","[Xe] 4f¹⁴ 5d⁹ 6s¹",[2,8,18,32,17,1],"d0d0e0",177,2.28],
  ["Au","Gold",196.97,"transition metal","[Xe] 4f¹⁴ 5d¹⁰ 6s¹",[2,8,18,32,18,1],"ffd123",174,2.54],
  ["Hg","Mercury",200.59,"transition metal","[Xe] 4f¹⁴ 5d¹⁰ 6s²",[2,8,18,32,18,2],"b8b8d0",171,2],
  ["Tl","Thallium",204.38,"post-transition metal","[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹",[2,8,18,32,18,3],"a6544d",156,1.62],
  ["Pb","Lead",207.2,"post-transition metal","[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²",[2,8,18,32,18,4],"575961",154,2.33],
  ["Bi","Bismuth",208.98,"post-transition metal","[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³",[2,8,18,32,18,5],"9e4fb5",143,2.02],
  ["Po","Polonium",209,"metalloid","[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴",[2,8,18,32,18,6],"ab5c00",135,2],
  ["At","Astatine",210,"metalloid","[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵",[2,8,18,32,18,7],"754f45",127,2.2],
  ["Rn","Radon",222,"noble gas","[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶",[2,8,18,32,18,8],"428296",120,2.2],
  ["Fr","Francium",223,"alkali metal","[Rn] 7s¹",[2,8,18,32,18,8,1],"420066",null,0.7],
  ["Ra","Radium",226,"alkaline earth metal","[Rn] 7s²",[2,8,18,32,18,8,2],"007d00",null,0.9],
  ["Ac","Actinium",227,"actinide","[Rn] 6d¹ 7s²",[2,8,18,32,18,9,2],"70abfa",195,1.1],
  ["Th","Thorium",232.04,"actinide","[Rn] 6d² 7s²",[2,8,18,32,18,10,2],"00baff",180,1.3],
  ["Pa","Protactinium",231.04,"actinide","[Rn] 5f² 6d¹ 7s²",[2,8,18,32,20,9,2],"00a1ff",180,1.5],
  ["U","Uranium",238.03,"actinide","[Rn] 5f³ 6d¹ 7s²",[2,8,18,32,21,9,2],"008fff",175,1.38],
  ["Np","Neptunium",237,"actinide","[Rn] 5f⁴ 6d¹ 7s²",[2,8,18,32,22,9,2],"0080ff",175,1.36],
  ["Pu","Plutonium",244,"actinide","[Rn] 5f⁶ 7s²",[2,8,18,32,24,8,2],"006bff",175,1.28],
  ["Am","Americium",243,"actinide","[Rn] 5f⁷ 7s²",[2,8,18,32,25,8,2],"545cf2",175,1.13],
  ["Cm","Curium",247,"actinide","[Rn] 5f⁷ 6d¹ 7s²",[2,8,18,32,25,9,2],"785ce3",176,1.28],
  ["Bk","Berkelium",247,"actinide","[Rn] 5f⁹ 7s²",[2,8,18,32,27,8,2],"8a4fe3",170,1.3],
  ["Cf","Californium",251,"actinide","[Rn] 5f¹⁰ 7s²",[2,8,18,32,28,8,2],"a136d4",173,1.3],
  ["Es","Einsteinium",252,"actinide","[Rn] 5f¹¹ 7s²",[2,8,18,32,29,8,2],"b31fd4",173,1.3],
  ["Fm","Fermium",257,"actinide","[Rn] 5f¹² 7s²",[2,8,18,32,30,8,2],"b31fba",173,1.3],
  ["Md","Mendelevium",258,"actinide","[Rn] 5f¹³ 7s²",[2,8,18,32,31,8,2],"b30da6",173,1.3],
  ["No","Nobelium",259,"actinide","[Rn] 5f¹⁴ 7s²",[2,8,18,32,32,8,2],"bd0d87",173,1.3],
  ["Lr","Lawrencium",262,"actinide","[Rn] 5f¹⁴ 7s² 7p¹",[2,8,18,32,32,8,3],"c70066",173,1.3],
  ["Rf","Rutherfordium",267,"transition metal","[Rn] 5f¹⁴ 6d² 7s²",[2,8,18,32,32,10,2],"cc0059",null,null],
  ["Db","Dubnium",270,"transition metal","[Rn] 5f¹⁴ 6d³ 7s²",[2,8,18,32,32,11,2],"d1004f",null,null],
  ["Sg","Seaborgium",271,"transition metal","[Rn] 5f¹⁴ 6d⁴ 7s²",[2,8,18,32,32,12,2],"d90045",null,null],
  ["Bh","Bohrium",270,"transition metal","[Rn] 5f¹⁴ 6d⁵ 7s²",[2,8,18,32,32,13,2],"e00038",null,null],
  ["Hs","Hassium",277,"transition metal","[Rn] 5f¹⁴ 6d⁶ 7s²",[2,8,18,32,32,14,2],"e6002e",null,null],
  ["Mt","Meitnerium",276,"unknown","[Rn] 5f¹⁴ 6d⁷ 7s²",[2,8,18,32,32,15,2],"eb0026",null,null],
  ["Ds","Darmstadtium",281,"unknown","[Rn] 5f¹⁴ 6d⁹ 7s¹",[2,8,18,32,32,17,1],"eb0026",null,null],
  ["Rg","Roentgenium",280,"unknown","[Rn] 5f¹⁴ 6d¹⁰ 7s¹",[2,8,18,32,32,18,1],"eb0026",null,null],
  ["Cn","Copernicium",285,"transition metal","[Rn] 5f¹⁴ 6d¹⁰ 7s²",[2,8,18,32,32,18,2],"eb0026",null,null],
  ["Nh","Nihonium",284,"unknown","[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹",[2,8,18,32,32,18,3],"eb0026",null,null],
  ["Fl","Flerovium",289,"post-transition metal","[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²",[2,8,18,32,32,18,4],"eb0026",null,null],
  ["Mc","Moscovium",288,"unknown","[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³",[2,8,18,32,32,18,5],"eb0026",null,null],
  ["Lv","Livermorium",293,"unknown","[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴",[2,8,18,32,32,18,6],"eb0026",null,null],
  ["Ts","Tennessine",294,"unknown","[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵",[2,8,18,32,32,18,7],"eb0026",null,null],
  ["Og","Oganesson",294,"unknown","[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶",[2,8,18,32,32,18,8],"eb0026",null,null]
];

export const ELEMENTS: ElementData[] = RAW_DATA.map((d, i) => {
    const num = i + 1;
    const pos = getPosition(num);
    return {
        number: num,
        symbol: d[0] as string,
        name: d[1] as string,
        mass: d[2] as number,
        category: d[3] as string,
        electron_configuration: d[4] as string,
        shells: d[5] as number[],
        cpkHex: d[6] as string,
        atomic_radius: d[7] as number | undefined,
        electronegativity: d[8] as number | undefined,
        ...pos
    };
});

export const getElement = (num: number) => ELEMENTS.find(e => e.number === num) || ELEMENTS[0];

export const getOrbitals = (element: ElementData) => {
    const orbitals = [];
    if (element.number >= 1) orbitals.push({ type: '1s', count: Math.min(element.number, 2) });
    if (element.number >= 3) orbitals.push({ type: '2s', count: Math.min(element.number - 2, 2) });
    if (element.number >= 5) orbitals.push({ type: '2p', count: Math.min(element.number - 4, 6) });
    if (element.number >= 11) orbitals.push({ type: '3s', count: Math.min(element.number - 10, 2) });
    if (element.number >= 13) orbitals.push({ type: '3p', count: Math.min(element.number - 12, 6) });
    if (element.number >= 19) orbitals.push({ type: '4s', count: Math.min(element.number - 18, 2) });
    if (element.number >= 21) orbitals.push({ type: '3d', count: Math.min(element.number - 20, 10) });
    if (element.number >= 31) orbitals.push({ type: '4p', count: Math.min(element.number - 30, 6) });
    return orbitals;
};

