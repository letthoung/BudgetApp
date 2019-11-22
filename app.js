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
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }
    
    return {
        addItem: function(type, des, val){
            var newItem, ID;
            
            // create new ID
            if(data.allItems[type].length === 0)
                ID = 0;
            else
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            
            // create newItem based on exp or inc type
            if(type === "exp"){
                newItem = new Expense(ID, des, val);
            } else {
                newItem = new Income(ID, des, val);
            }
            
            // add the new Item to the list that it belongs to
            data.allItems[type].push(newItem);
            
            // return the new Item
            return newItem;
        },
        testing: function(){
            console.log(data);
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
        var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
    };
    
    return {
        init: function(){
            setUpEventListener();
        } 
    }
    
})(budgetController, UIController);

// Without this line of code, nothing happens
controller.init();