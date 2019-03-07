import { gjendjet, kalimePaEpsilon } from "./";

const additionalFinalStates = [];

const findEpsilonTransition = (states) => {

    const epsilonStates = [];

    Object.keys(states).forEach(nextState => {
        if(states[nextState].includes('ɛ')){
            epsilonStates.push(nextState);
        }
    });

    return epsilonStates;
};

const epsilonTable = (automat, finalState) => {
    const states = gjendjet(automat);
    const epsilonTable = {};

    states.forEach(state => {
        epsilonTable[state] = [state];
    });


    Object.keys(automat).forEach(state => {
        Object.keys(automat[state]).forEach(nextState => {

            const value = automat[state][nextState].find(el => el === 'ɛ');
            let epsilonStates = epsilonTable[state];

            if(!!value){

                epsilonStates = [...epsilonStates, nextState];
                if(nextState !== state && nextState !== finalState){
                    epsilonStates = [ ...epsilonStates, ...findEpsilonTransition(automat[nextState])];
                }

                if(epsilonStates.includes(finalState) && !additionalFinalStates.includes(state)){
                    additionalFinalStates.push(state);
                }
            }

            epsilonTable[state] = epsilonStates;
        })
    });
    return epsilonTable;
};

const findStateByTransition = (automat,state, transition) => {
    let elements = [];
    Object.keys(automat[state]).forEach(nextState => {
        if(automat[state][nextState].includes(transition)){
            elements.push(nextState);
        }
    });

    return elements;
};

const traverseByTransition = (alfabeti, automat, gjendjet)=> {

    const finalStep = {};

    gjendjet.forEach(gjendje => {
        finalStep[gjendje] = {};
    });

    alfabeti.forEach(kalim => {
        Object.keys(automat).forEach(key => {
            Object.values(automat[key]).forEach(states => {

                states[kalim].forEach(currentKey => {

                    let currentState = finalStep[key][currentKey];

                    if(currentState){
                        if(!currentState.includes(kalim))
                            currentState.push(kalim)
                    }else{
                        currentState = [kalim];
                    }

                    finalStep[key][currentKey] = currentState;
                })
            })
        })
    });

    return finalStep;

};

export default (automat, finalState) => {
    const alfabeti = kalimePaEpsilon(automat);
    const epsilon_table = epsilonTable(automat,finalState);

    const transitionStates = {};

    Object.keys(epsilon_table).forEach(epsilonStates => {

        transitionStates[epsilonStates] = {};

        epsilon_table[epsilonStates].forEach(state => {
            transitionStates[epsilonStates][state] = {};
            alfabeti.forEach(char => {

                transitionStates[epsilonStates][state][char] = findStateByTransition(automat,state,char).map(lastStepState => epsilon_table[lastStepState])[0] || [];

            })
        })
    });

    return {
        automat: traverseByTransition(alfabeti, transitionStates, gjendjet(automat)),
        additionalFinalStates
    };

}


// ɛ