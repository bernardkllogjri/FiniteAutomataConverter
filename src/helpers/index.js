import sortBy from "lodash/sortBy"
import uniq from "lodash/uniq"
import toAFD from "./toAFD";
import toAFJD from "./toAFJD";
export { toAFD, toAFJD };

export const kalimet = automati => {
    let kalimet = [];

    Object.values(automati).forEach(automat => {
        Object.values(automat).forEach(kalim => {

            kalimet = [...kalim.reduce((acc, value) => {
                if(!acc.includes(value)){
                    return [...acc, value]
                }
                return acc;
            },kalimet)];

        })
    });
    return kalimet
};

export const kalimePaEpsilon = automat => kalimet(automat).filter(char => char !== 'ɛ');

export const gjendjet = automati => {
    const states = [];
    Object.keys(automati).forEach(gjendje => {
        if(!states.includes(gjendje)){
            states.push(gjendje);
        }
    });

    return states;
};

export const addNewKeys = (AFDTable, newKeys, alfabeti) => {

    const keys = [];

    newKeys.forEach(key => {

        AFDTable[key] = {};
        alfabeti.forEach(kalim => {

            const newKey = sortBy(uniq((
                key.split(",").reduce((acc,splitKey) => ([...AFDTable[splitKey][kalim], ...acc]),[]
            ))));

            AFDTable[key][kalim] = newKey;
            const joinedKey = newKey.join(",");

            if(!keys.includes(joinedKey)){
                keys.push(joinedKey);
            }
        })

    });

    return { table: AFDTable, keys};
};

