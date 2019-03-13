import sortBy from "lodash/sortBy"
import uniq from "lodash/uniq"
import intersection from "lodash/intersection"
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

export const afdGraph = (AFD,finalStates, kalimetFillestare) => {
    const keys = [...Object.keys(AFD), "e"];
    const nodes = keys.reduce((acc, state, index) => [...acc, {
        id: index,
        label: state,
        borderWidth: (intersection(finalStates,state.split(",")).length ? 5 : 1)
    }],[]);

    console.log(nodes);
    const edges = nodes.reduce((acc, node) => {
        const nextNode = AFD[node.label];
        let transitions = [];

        if(!!nextNode){
            transitions = Object.keys(nextNode).reduce((states,state) => {
                const label = sortBy(AFD[node.label][state]).join(",");
                if(!!label){
                    return [...states, {from: node.id, to: nodes.find(el => el.label === label).id, label: state }]
                }else{
                    return [...states, {from: node.id, to: nodes.find(el => el.label === "e").id, label: state }]
                }
            },[]);
        }else{
            transitions = kalimetFillestare.map( kalimi => ({ from: node.id, to: nodes.find(el => el.label === "e").id, label: kalimi }))
        }


        return [...acc, ...transitions];
    },[]);

    const finalEdges = edges.reduce((acc,edge) => {
        let found = false;
        acc.forEach((el,index) => {
            if(el.from === edge.from && el.to === edge.to){
                acc[index] = { ...edge, ...{ label: edge.label+=`,${el.label }` } };
                found = true;
            }
        });

        if(found){
            return acc;
        }
        return [ ...acc, edge]
    },[]);

    console.log(finalEdges);


    return { edges: finalEdges, nodes };
};