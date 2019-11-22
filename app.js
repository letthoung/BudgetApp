/*BUDGET CONTROLLER*/
var budgetController = (function(){
    
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this. value = value;
    };
    
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this. value = value;
    };
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        }
    }
    
    
})();




/*UI CONTROLLER*/
var UIController = (function(){
    var DOMStrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        addBtn: ".add__btn"
    }
    return {
        getInput: function (){
            return {
            // addType will have either of two values: "inc" for + or "exp" for -
            type: document.querySelector(DOMStrings.inputType).value,
            description: document.querySelector(DOMStrings.inputDescription).value,
            value: document.querySelector(DOMStrings.inputValue).value
            }
        },
        
        getDOMStrings: function(){
            return DOMStrings;
        }
    }
    
})();





/*GLOBAL APP CONTROLLER*/
var controller = (function(budgetCtrl, UICtrl){
    
    var setUpEventListener = function(){
        var DOMStrings = UICtrl.getDOMStrings();
        
        document.querySelector(DOMStrings.addBtn).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress', function(event){
            // check if Enter is pressed
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        })
    };
    
    var ctrlAddItem = function(){
        //1. Get the field input data
        var input = UICtrl.getInput();
        console.log(input);
            
        //2. Add the item to the budget controller
        
        
    };
    
    return {
        init: function(){
            console.log('Started');
            setUpEventListener();
        }
    }
    
})(budgetController, UIController);

controller.init(); // Without this line of code, nothing happens