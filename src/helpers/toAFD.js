import { addNewKeys, gjendjet, kalimet } from "./";
import sortBy from "lodash/sortBy"

export default automati => {
    const AFDTable = {};
    const newKeys = [];
    const keys = Object.keys(automati);
    const alfabeti = kalimet(automati);

    keys.forEach(state => {
        AFDTable[state] = {};
        alfabeti.forEach(kalim => {

            const recievingStates = [];
            const innerStates = Object.keys(automati[state]);

            innerStates.forEach(innerState => {
                if(automati[state][innerState].includes(kalim) && !recievingStates.includes(innerState)){
                    recievingStates.push(innerState);
                }
            });

            AFDTable[state][kalim] = recievingStates;

            const newState = sortBy(recievingStates).join(",");

            if(recievingStates.length > 1 && !recievingStates.includes(newState)){
                newKeys.push(newState);
            }

        })
    });


    let table = addNewKeys(AFDTable, newKeys, alfabeti);
    let intersection = table.keys.filter(key => !gjendjet(table.table).includes(key));

    const filter = key => { console.log(key); return !gjendjet(table.table).includes(key) };

    while(intersection.length){
        table = addNewKeys(table.table, intersection, alfabeti);
        intersection = table.keys.filter(filter);
    }

    return table.table;
};