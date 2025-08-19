const femaleFields = ["P0120027", "P0120028", "P0120029", "F1519", "F2024", "P0120035", "P0120036", "P0120037", "P0120038", "P0120039", "P0120040", "P0120041", "F6064", "F6569", "P0120046", "P0120047", "P0120048", "P0120049"]
const maleFields = ["P0120003", "P0120004", "P0120005", "M1519", "M2024", "P0120011", "P0120012", "P0120013", "P0120014", "P0120015", "P0120016", "P0120017", "M6064", "M6569", "P0120022", "P0120023", "P0120024", "P0120025"]
const urbanRuralFields = ["P0020002", "P0020003"]
const raceFields = ["P0030002", "P0030003", "P0030004", "P0030005", "P0030006", "P0030007", "P0030008"]


export default function queryData(attributes) {
    //Preparation for using the chart for data display. 
    // First need to optimize dataset to be able to provide data more cleanly.
    const femaleAgeData = []
    const maleAgeData = []
    const urbanRuralData = []
    const raceData = []

    for (let key in attributes) {
        if (femaleFields.includes(key)) {
            femaleAgeData.push(attributes[key])
        }
        else if (maleFields.includes(key)) {
            maleAgeData.push(-Math.abs(attributes[key]))
        }
        else if (urbanRuralFields.includes(key)) {
            urbanRuralData.push(attributes[key])
        }
        else if (raceFields.includes(key)) {
            raceData.push(attributes[key])
        }
    }
    return [femaleAgeData, maleAgeData, urbanRuralData, raceData]

}