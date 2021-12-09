<template>
    <div>
    <table id="expenseTable" class="blueTable">
        <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Name</th>
            <th>Description</th>
            <th>Amount</th>
        </tr>
        <tr v-for="expense in expenses" :key="expense._id" :id="'ex_row_' + expense._id">
            <td>
                {{ expense.Date }}
            </td>
            <td>
                {{ expense.Type }}
            </td>
            <td>
                {{ expense.Name }}
            </td>
            <td>
                {{ expense.Description }}
            </td>
            <td>
                ${{ expense.Amount }}
            </td>
            <td>
                <button class="btn" v-on:click="editExpense(expense, $event)"><i class="fa fa-edit"></i></button>
                <button class="btn" v-on:click="deleteExpense(expense)"><i class="fa fa-trash"></i></button>
            </td>
        </tr>
        <tr>
            <td>
                <input type="date" v-model="expense.Date">
            </td>
            <td>
                <input type="text" v-model="expense.Type">
            </td>
            <td>
                <input type="text" v-model="expense.Name">
            </td>
            <td>
                <input type="text" v-model="expense.Description">
            </td>
            <td>
                <input type="text" v-model="expense.Amount">
            </td>
        </tr>
    </table>
    <button v-if="!editMode" v-on:click="addExpense">Add Expense</button>
    <button v-else v-on:click="updateExpense">Save Expense</button>
    </div>
</template>

<script>
import ExpensesDataService from '../services/ExpensesDataService'


export default {
  name: 'ExpenseTable',
  data() {
        return {
            expenses: [],
            expense: {
                _id: '',
                Name: '',
                Date: '',
                Type: '',
                Description: '',
                Amount: ''
            },
            editMode: false
        }
    },
    methods: {
        getExpenses() {
            ExpensesDataService.getAllExpenses()
                .then(response => {
                    this.expenses = response.data;
                    console.log(response.data);
                })
        },
        addExpense() {
            var expense = {
                _id: this.expense._id,
                Name: this.expense.Name,
                Date: this.expense.Date,
                Type: this.expense.Type,
                Description: this.expense.Description,
                Amount: this.expense.Amount
            }
            console.log(this.expense.Date)

            ExpensesDataService.addExpense(expense)
                .then(response => {
                    console.log("Data added")
                    console.log(response.status)
                    
                })
            console.log('clicked');
            this.expense = {}
            this.getExpenses()
        },
        editExpense(expense) {
            this.expense = expense
            this.editMode = true
        },
        updateExpense() {
            var expense = {
                _id: this.expense._id,
                Name: this.expense.Name,
                Date: this.expense.Date,
                Type: this.expense.Type,
                Description: this.expense.Description,
                Amount: this.expense.Amount
            }
            ExpensesDataService.updateExpense(expense)
                .then(response => {
                    console.log("Data updated")
                    console.log(response.status)
                    
                })
            this.expense = {}
            this.editMode = false
            this.getExpenses()
        },
        deleteExpense(expense) {
            ExpensesDataService.deleteExpense(expense)
                .then(response => {
                    console.log("Data deleted")
                    console.log(response.status)
                    
                })
            this.expense = {}
            this.getExpenses()
        }
    },
    //Mount the above get method for instant call to it
    mounted() {
        this.getExpenses()
    }
}
</script>

<!-- TODO: Improve styling of the table -->
<style>
table.blueTable {
  font-family: "Lucida Console", Monaco, monospace;
  background-color: #EEEEEE;
  width: 100%;
  height: 100%;
  margin-top: 50px;
  text-align: left;
}
table.blueTable td, table.blueTable th {
  border: 1px solid #AAAAAA;
  padding: 6px 4px;
}
table.blueTable tbody td {
  font-size: 12px;
}
table.blueTable tr:nth-child(even) {
  background: #B8B8B8;
}
table.blueTable thead {
  background: #000000;
  background: -moz-linear-gradient(top, #404040 0%, #191919 66%, #000000 100%);
  background: -webkit-linear-gradient(top, #404040 0%, #191919 66%, #000000 100%);
  background: linear-gradient(to bottom, #404040 0%, #191919 66%, #000000 100%);
}
table.blueTable thead th {
  font-size: 14px;
  font-weight: bold;
  color: #FFFFFF;
  text-align: left;
}
table.blueTable tfoot {
  font-size: 14px;
  font-weight: bold;
  color: #FFFFFF;
  background: #D0E4F5;
  background: -moz-linear-gradient(top, #dcebf7 0%, #d4e6f6 66%, #D0E4F5 100%);
  background: -webkit-linear-gradient(top, #dcebf7 0%, #d4e6f6 66%, #D0E4F5 100%);
  background: linear-gradient(to bottom, #dcebf7 0%, #d4e6f6 66%, #D0E4F5 100%);
  border-top: 2px solid #444444;
}
table.blueTable tfoot td {
  font-size: 14px;
}
table.blueTable tfoot .links {
  text-align: right;
}
table.blueTable tfoot .links a{
  display: inline-block;
  background: #1C6EA4;
  color: #FFFFFF;
  padding: 2px 8px;
  border-radius: 5px;
}
</style>