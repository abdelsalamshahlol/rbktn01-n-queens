// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      let conflictCheck = false;

      if(rowIndex > this.attributes.n){
        return 'Invalid Row Index';
      }

      if(typeof(this.attributes[rowIndex]) === 'object'){
        conflictCheck = this.attributes[rowIndex].filter((elem)=> elem === 1).length > 1;
      }
      
      return conflictCheck; 
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      let conflictCheck = false;

      for(var index in this.attributes){
        conflictCheck = conflictCheck || this.hasRowConflictAt(index);
      }

      return conflictCheck;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      let conflictCheck = false;
      let tmpArr = [];

      for(var key in this.attributes){
        if(key !== 'n'){
          tmpArr.push(this.attributes[key][colIndex])
        }       
      } 
      conflictCheck = tmpArr.filter((elem)=> elem === 1).length > 1;

      return conflictCheck; 
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      let conflictCheck = false;

      for(var index in this.attributes){
        conflictCheck = conflictCheck || this.hasColConflictAt(index);
      }

      return conflictCheck;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      let start = majorDiagonalColumnIndexAtFirstRow;
      let lower = this.attributes.n-1;
      let conflictCheck = false;
      let tmpArr = new Array();

      for(var key = 0; key <= this.attributes.n - 1 ; key++){
        if(majorDiagonalColumnIndexAtFirstRow === 0){
          tmpArr.push(this.attributes[key][key]);
        }else{          
          if(start <= this.attributes.n - 1){
            tmpArr.push(this.attributes[key][start++]);
           // this.attributes[key][--lower] = 'edit' this for the other
          }
          if (key > 0 ){
            tmpArr.push(this.attributes[key][key-1])
          }
        }
      }

      conflictCheck = tmpArr.filter((elem)=> elem === 1).length > 1;

      return conflictCheck;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      let conflictCheck = false;

      for(var index = 0; index <= this.attributes.n - 1 ; index++){
        conflictCheck = conflictCheck || this.hasMajorDiagonalConflictAt(index);
      }

      return conflictCheck;      
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      let start = minorDiagonalColumnIndexAtFirstRow;
      // let counter = this.attributes.n ;
      let counter = minorDiagonalColumnIndexAtFirstRow; // continue 
      let conflictCheck = false;
      let tmpArr = new Array();

      for(var key = 0; key <= this.attributes.n - 1 ; key++){
          // this.attributes[key][--counter] = 'editedddddddddddddd'
          tmpArr.push(this.attributes[key][--counter]);
      }

      conflictCheck = tmpArr.filter((elem)=> elem === 1).length > 1;

      return conflictCheck;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      let conflictCheck = false;

      for(var index = 0; index <= this.attributes.n - 1 ; index++){
        conflictCheck = conflictCheck || this.hasMinorDiagonalConflictAt(index);
      }

      return conflictCheck;  
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
