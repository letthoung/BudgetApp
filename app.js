/*BUDGET CONTROLLER*/
var budgetController = (function(){
    
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this. value = value;
        this.percentage = -1;
    };
    
    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value/totalIncome)*100);
        }
    }
    
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }
    
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
        percent: -1,
        budget: 0
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
        
        calculatePercentages: function(){
            data.allItems.exp.forEach(function(current){
               current.calcPercentage(data.totals.inc); 
            });
        },
        
        getPercentages: function(){
            return data.allItems.exp.map(function(current){
                return current.getPercentage();
            });
        },
        
        deleteItem: function(type, id){
            
            // get the list of ids which are associate with items
            // this maybe not efficient because we have to get this array
            var ids = data.allItems[type].map(function(current){
                return current.id;
            })
            
            var index = ids.indexOf(id);
            
            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },
        
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,
                inc: data.allItems.inc
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
        budgetLabel: ".budget__value",
        container: ".container",
        expensesPercLabel: ".item__percentage"
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
                html =      '<div class="item clearfix" id="inc-%id%">';
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
                html =      '<div class="item clearfix" id="exp-%id%">';
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
        
        deleteListItem: function(itemID){
            
            var item = document.getElementById(itemID);
            var parent = item.parentNode;
            
            parent.removeChild(item);
            
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
            if (obj.percentage > 0)
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + "%";
            else
                document.querySelector(DOMStrings.percentageLabel).textContent = "---";
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;
        },
        
        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
            for (var i = 0; i < fields.length; ++i){
                fields[i].textContent = percentages[i] + "%";
            }
            
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
        
        document.querySelector(DOMStrings.container).addEventListener('click', ctrlDeleteItem);
        
    };
    
    // This function is invoked when any change cause to the budget
    var updateBudget = function(){
        //1. Update budget
        budgetCtrl.calculateBudget();
        
        //2. Return budget
        var budget = budgetCtrl.getBudget();
        
        //3. Display the budget to the UI
        UICtrl.displayBudget(budget);
    };
    
    // This function is invoked when any change cause to the budget
    var updatePercentages = function(){
        //1. Calculate percentages
        budgetCtrl.calculatePercentages();
        
        //2. Read percentages from budget controller
        var percentages = budgetCtrl.getPercentages();
        
        //3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
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
            
            //6. Calculate and update percentages in each of the expense
            updatePercentages();
        } else {
            window.alert("Input is invalid!! Try again.");
        }
    };
    
    // This function is invoked when any of the delete button is clicked (using event delegation)
    var ctrlDeleteItem =function(event) {
        var itemID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            // split to get the item type and the item ID in the array of the item list
            var SplitID = itemID.split('-');
            type = SplitID[0];
            ID = parseInt(SplitID[1]);
            
            //1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            
            //2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);
            
            //3. Update and show the new budget
            updateBudget();
            
            //7. Calculate and update percentages in each of the expense
            updatePercentages();
        }
    }
    
    return {
        init: function(){
            setUpEventListener();
        } 
    }
    
})(budgetController, UIController);

// Without this line of code, nothing happens
controller.init();