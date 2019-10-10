function eval() {
    // Do not use eval!!!
    return;
}

// " 11 - 92 + 48 / (  (  12 / 92 + (  53 / 74 / 22 + (  61 / 24 / 42 - (  13 * 85 + 100 / 77 / 11  ) + 89  ) + 9  ) + 87  ) / 91 * 92  ) "

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
            // i--;
        }

        if( isOperator( currChar ) ){

            if( currChar == '(' ){

                opStack.push( currChar );

            } else if( currChar == ')' ) {
                // Closing Bracket

                let tmpChar = '';
                while( opStack.size() && tmpChar !== '(' ){
                    tmpChar = opStack.pop();
                    if( '()'.indexOf( tmpChar ) == -1 ){
                        currLiteral = currLiteral.concat( tmpChar, ' ');    
                    }
                }

                if( opStack.peek() == '(' ){ opStack.pop() ; }

            } else {
                // currChar is REAL operator
                let notPushed = true;

                if( 
                    opStack.size() && 
                    ( getPriority( currChar ) <= getPriority( opStack.peek() ) )
                ){
                    currLiteral  = currLiteral.concat( opStack.pop(),  ' ');
                    if( getPriority( opStack.peek() ) == getPriority( currChar ) ){
                        opStack.push( currChar );
                        notPushed = false;
                    }
                }

                if( notPushed ){ opStack.push( currChar ); }

            } // currChar : not braces, just operators
        } // operators including braces


    } // main for


    while( opStack.size() ){
        currLiteral = currLiteral.concat( opStack.pop(), ' ');
    }


    return currLiteral;

}

let RPNEvaluate = ( RPNExpression ) => {
    let tmpStack = new JSStack();

    for( let i=0; i<RPNExpression.length; i++ ) {
        let currCh = RPNExpression[ i ];
        
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
    } // main for 

    return tmpStack.peek();
}


function expressionCalculator(expr) {
    let tmpStack = new JSStack();
    let result = 0;
    let exprRPN = parseExpression( expr );


    if( hasBrackets( expr ) && !checkBrackets( expr, [ ['(', ')'] ] ) ){
        throw new Error( 'ExpressionError: Brackets must be paired' );
    }

    result = RPNEvaluate( exprRPN );
    return result;



}

module.exports = {
    expressionCalculator
}