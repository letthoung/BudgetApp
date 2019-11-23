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
        },
        budget: 0,
        percentage: -1,
    }
    
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(current){
            sum += current.value;
        });
        data.totals[type] = sum;
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
        
        calculateBudget: function(){
            // Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            // Calculate the budget = income -expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            // Calculate the percentage of income that we spent
            if (data.totals.inc > 0)
                data.percentage = Math.round(data.totals.exp/data.totals.inc * 100);
        },
        
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        }
    }
     
})();




/*UI CONTROLLER*/
var UIController = (function(){
    // this object content names of DOM components, using for querySelector 
    var DOMStrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        addBtn: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list",
        expensesLabel: ".budget__expenses--value",
        incomeLabel: ".budget__income--value",
        percentageLabel: ".budget__expenses--percentage",
        budgetLabel: ".budget__value"
    }
    
    // return for outside accessing
    return {
        // get all the user inputs
        getInput: function (){
            return {
            // addType will have either of two values: "inc" for + or "exp" for -
            type: document.querySelector(DOMStrings.inputType).value,
            description: document.querySelector(DOMStrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },
        
        getDOMStrings: function(){
            return DOMStrings;
        },
        
        addListItem: function(obj, type){
            var html, newHtml, element;
            // Create HTML string with placeholder text
            if (type === "inc"){
                element = DOMStrings.incomeContainer;
                html =      '<div class="item clearfix" id="income-%id%">';
                html +=         '<div class="item__description">%description%</div>';
                html +=         '<div class="right clearfix">';
                html +=             '<div class="item__value">%value%</div>';
                html +=             '<div class="item__delete">';
                html +=                  '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>';
                html +=             '</div>';
                html +=         '</div>';
                html +=     '</div>';
            } else if (type === "exp") {
                element = DOMStrings.expensesContainer;
                html =      '<div class="item clearfix" id="expense-%id%">';
                html +=         '<div class="item__description">%description%</div>';
                html +=         '<div class="right clearfix">';
                html +=             '<div class="item__value">%value%</div>';
                html +=             '<div class="item__percentage">%percentage%</div>';
                html +=             '<div class="item__delete">';
                html +=                 '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>';
                html +=             '</div>';
                html +=         '</div>';
                html +=     '</div>';
            }
            
            // Replace the place holder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            // Insert HTML to the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        clearFields: function(){
            
            var fieldsToClear = document.querySelectorAll(DOMStrings.inputDescription + ", " + DOMStrings.inputValue);
            
            var fieldsArray = Array.prototype.slice.call(fieldsToClear); // transform the list to be an array
            fieldsArray.forEach(function(current, index, array){
                current.value = "";
            })
            
            fieldsArray[0].focus(); //This set the focus back to the description box
        },
        
        displayBudget: function(obj){
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;
            document.querySelector(DOMStrings.percentageLabel).textContent = obj.precentage;
        }
    }
})();





/*GLOBAL APP CONTROLLER*/
var controller = (function(budgetCtrl, UICtrl){
    // Implementation of setting up event listener
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
    
    var updateBudget = function(){
        //1. Update budget
        budgetCtrl.calculateBudget();
        
        //2. Return budget
        var budget = budgetCtrl.getBudget();
        
        //3. Display the budget to the UI
        UICtrl.displayBudget(budget);
    };
    
    // This function is invoked when the event listener recieve a click or Enter key
    var ctrlAddItem = function(){
        
        //1. Get the field input data
        var input = UICtrl.getInput();
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0){
            //2. Add the item to the budget controller
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            //4. Clear Fields
            UICtrl.clearFields();

            //5. Calculate and update budget
            updateBudget();
        } else {
            window.alert("Input is invalid!! Try again.");
        }
    };
    
    return {
        init: function(){
            setUpEventListener();
        } 
    }
    
})(budgetController, UIController);

// Without this line of code, nothing happens
controller.init();