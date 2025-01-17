function eval() {
    // Do not use eval!!!
    return;
}

let checkBrackets = (str, bracketsConfig) => {

    function MakeHumanBrackets( srcBracketsConfig ){
        return srcBracketsConfig.map( ( configArray ) => {
            return configArray.join( '' );
        } );
    }

    function ReduceBrackets( strSource, humanBracketsCfg ){
        let strResult = strSource;

        for( curBracketsIndex = 0; curBracketsIndex < humanBracketsCfg.length; curBracketsIndex++  ){
            let currentBrackets = humanBracketsCfg[ curBracketsIndex ];
            for( let charIndex = 0; charIndex < strResult.length;  ){

                if( strResult.indexOf( currentBrackets ) > -1 ){

                    strResult = strResult.replace( currentBrackets, '' );
                    charIndex = -1;
                    curBracketsIndex = -1;

                } else {

                    charIndex = strResult.length;

                }

            }

        }

        return strResult;
    }


    let humanBracketsConfig = MakeHumanBrackets( bracketsConfig );
    let strCleared = ReduceBrackets( str, humanBracketsConfig );

    return( !strCleared.length );


  // your solution
} 

let hasBrackets = ( str ) => {
    return( str.indexOf( '(' ) > -1 || str.indexOf( ')' ) > -1 );
}

class JSStack {

    constructor() {
        this.storage = [];
    }

    push( data ) {
        this.storage.push( data );
        return this.storage.length;
    }

    pop() {
        if( this.storage.length == 0 ){
            return null;
        } else return this.storage.pop();
    }

    peek() {
        return this.storage[ this.storage.length - 1 ];
    }

    isEmpty(  ){
        return this.storage.length == 0;
    }

    size(){
        return this.storage.length;
    }


}

let isDelimiter = ( aChar ) => {
    return( ' ='.indexOf( aChar ) !== -1 );
}

let removeSpaces = ( anExpression ) => {
    let retResult = anExpression;
    return retResult.split( ' ' ).join( '' );
}

let isOperator = ( aChar ) => {
    return ( '+-*/()'.indexOf( aChar ) !== -1 ) ;
}

let isDigit = ( aChar ) => {
    return( '0123456789'.indexOf( aChar ) !== -1 );
}

let getPriority = ( aChar ) => {
    let result = 6;
    switch( aChar ){
        case '(' : result = 0; break;
        case ')' : result = 1; break;
        case '+' : result = 2; break;
        case '-' : result = 2; break; // result = 3 in original
        case '*' : result = 4; break;
        case '/' : result = 4; break;
        case '^' : result = 5; break;
    }
    return result;
}

let parseExpression = ( anExpression ) => {
    let exprNoSpaces = removeSpaces( anExpression );
    if( 
        exprNoSpaces[0] !== '(' || 
        exprNoSpaces[ exprNoSpaces.length - 1 ] !== ')'
        ){
        exprNoSpaces = '(' + exprNoSpaces + ')';
    }
    let currLiteral = '';
    let opStack = new JSStack();

    for ( let i=0; i<exprNoSpaces.length; i++  ){
        let currChar = exprNoSpaces[ i ];
        
        if( isDigit( currChar ) ){

            while( isDigit( currChar ) ){
                currLiteral = currLiteral.concat( currChar );
                i++;
                currChar = exprNoSpaces[ i ];
            }
            currLiteral = currLiteral.concat( ' ' );
        }

        if( isOperator( currChar ) ){

            if( currChar == '(' ){

                opStack.push( currChar );

            } else if( currChar == ')' ) {

                let tmpChar = '';
                while( opStack.size() && tmpChar !== '(' ){
                    tmpChar = opStack.pop();
                    if( '()'.indexOf( tmpChar ) == -1 ){
                        currLiteral = currLiteral.concat( tmpChar, ' ');    
                    }
                }

                if( opStack.peek() == '(' ){ opStack.pop() ; }

            } else {
                let notPushed = true;

                while(
                    opStack.size() && 
                    ( getPriority( currChar ) <= getPriority( opStack.peek() ) )
                ){
                    currLiteral  = currLiteral.concat( opStack.pop(),  ' ');
                }

                if( notPushed ){ opStack.push( currChar ); }

            }
        }


    }


    while( opStack.size() ){
        currLiteral = currLiteral.concat( opStack.pop(), ' ');
    }


    return currLiteral;

}

let RPNEvaluate = ( RPNExpression ) => {
    let tmpStack = new JSStack();

    for( let i=0; i<RPNExpression.length; i++ ) {
        let currCh = RPNExpression[ i ];
        if( ' ='.indexOf( currCh ) > -1 ){
            continue;
        }
        
        if( isDigit( currCh ) ){
            let tmpStr = '';
            while( RPNExpression[ i ] && isDigit( RPNExpression[ i ] ) ){
                tmpStr = tmpStr.concat( RPNExpression[ i ] );
                i+=1;
            }
            tmpStack.push( parseInt( tmpStr ) );
            i-=1;
        } else if ( isOperator( currCh ) ){
            let b = tmpStack.pop();
            let a = tmpStack.pop();
            let tmpResult = null;
            switch( currCh ){
                case '+': tmpResult = a+b ; break;
                case '-': tmpResult = a-b ; break;
                case '*': tmpResult = a*b ; break;
                case '/': 
                        if( b == 0 ){ 
                            throw new Error( "TypeError: Division by zero." ); 
                        } else {
                            tmpResult = a/b ;
                        }
                        break;
            }
            tmpStack.push( tmpResult );
        }
    }

    return tmpStack.peek();
}

let getOnlyBrackets = ( anExpression ) => {
    let strBrackets = '';

    for( let i=0; i< anExpression.length; i++ ){
        if( '()'.indexOf( anExpression[ i ] ) !== -1 ){
            strBrackets += anExpression[ i ];
        }
    }
    return strBrackets;
}


function expressionCalculator(expr) {
    let tmpStack = new JSStack();
    let result = 0;
    const exprBracketsConfig = [['(', ')']];
    let strBracketsTest = getOnlyBrackets( expr );


    if( strBracketsTest.length &&
        !checkBrackets( strBracketsTest, exprBracketsConfig ) 
    ){
        throw new Error( 'ExpressionError: Brackets must be paired' );
    }

    let exprRPN = parseExpression( expr );
    result = RPNEvaluate( exprRPN );
    return result;
}

module.exports = {
    expressionCalculator
}