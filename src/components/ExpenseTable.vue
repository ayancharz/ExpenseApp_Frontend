<template>
    <div>
        <v-container fluid> 
            <v-row align="center">
                <v-col cols="4">
                    <v-select
                        :items="listMonths"
                        label="Month"
                        v-model="selectListMonth"
                        menu-props="auto"
                        hide-details
                        single-line
                        solo
                        @input="getExpenses()"
                    ></v-select>
                </v-col>
                <v-col cols="4">
                    <v-select
                        :items="listYears"
                        label="Year"
                        v-model="selectedYear"
                        menu-props="auto"
                        hide-details
                        single-line
                        solo
                        @input="getExpenses()"
                    ></v-select>
                </v-col>
            </v-row>
        </v-container>
        
        
        <v-data-table
            :headers="headers"
            :items="expenses"
            class="elevation-1"
            :sort-by.sync="sortBy"
        >
            <template v-slot:body="{ items }">
                <tbody>
                <tr v-for="expense,index in items" :key="expense._id" :id="'ex_row_' + expense._id">
                    <td v-if="index !== rowIndex">
                        {{ expense.Date }}
                    </td>
                    <td v-else>
                        <input type="date" v-model="expense.Date">
                    </td>

                    <td v-if="index !== rowIndex">
                        {{ expense.Type }}
                    </td>
                    <td v-else>
                        <v-select
                            :items="expenseTypes"
                            v-model="expense.Type"
                        ></v-select>
                    </td>

                    <td v-if="index !== rowIndex">
                        {{ expense.Name }}
                    </td>
                    <td v-else>
                        <v-text-field v-model="expense.Name"></v-text-field>
                    </td>

                    <td v-if="index !== rowIndex">
                        {{ expense.Description }}
                    </td>
                    <td v-else>
                        <v-text-field v-model="expense.Description"></v-text-field>
                    </td>

                    <td :colspan="expenseCategories.length">
                        
                        <v-row>
                        <v-col v-for="category in expenseCategories" :key="category">
                            <span v-if="index !== rowIndex">
                            {{expense.Category == category ? expense.Amount : ''}}
                            </span>
                            <v-checkbox v-else 
                                v-model="selectedRowCategory"
                                :value="category"
                                @click="checkBoxGroup = category"   
                            ></v-checkbox>
                            </v-col>
                        </v-row>
                        
                    </td>

                    <td v-if="index !== rowIndex">
                        {{ expense.Amount }}
                    </td>
                    <td v-else>
                        <v-text-field v-model.number="expense.Amount"></v-text-field>
                    </td>

                    <td>
                        <v-icon
                            small
                            v-if="index !== rowIndex"
                            class="mr-2"
                            @click="editExpense(expense, index)"
                            >
                            mdi-pencil
                        </v-icon>
                        <v-icon
                            small
                            v-else
                            class="mr-2"
                            @click="updateExpense(expense)"
                            >
                            mdi-content-save
                        </v-icon>
                        <v-icon
                            small
                            v-if="index !== rowIndex"
                            @click="deleteExpense(expense)"
                            >
                            mdi-delete
                        </v-icon>
                        <v-icon
                            small
                            v-else
                            @click="closeEditMode()"
                            >
                            mdi-close-circle
                        </v-icon>
                    </td>
                </tr>
                <tr v-if="addMode">
                    <td>
                        <input type="date" v-model="expense.Date">
                    </td>
                    <td>
                        <v-select
                            :items="expenseTypes"
                            v-model="expense.Type"
                        ></v-select>
                    </td>
                    <td>
                        <v-text-field v-model="expense.Name"></v-text-field>
                    </td>
                    <td>
                        <v-text-field v-model="expense.Description"></v-text-field>
                    </td>
                    <td v-for="category in expenseCategories" :key="category">
                        <v-checkbox
                            v-model="selectedRowCategory"
                            :value="category"
                            @click="checkBoxGroup = category"
                        ></v-checkbox>
                    </td>
                    <td>
                        <v-text-field v-model.number="expense.Amount"></v-text-field>
                    </td>
                    <td>
                        <v-icon
                            small
                            color="primary" 
                            class="mr-2"
                            @click="addExpense"
                            >
                            mdi-content-save
                        </v-icon>
                        <v-icon
                            small
                            @click="toggleAddFields()"
                            >
                            mdi-close-circle
                        </v-icon>
                    </td>
                </tr>
                </tbody>
            </template>
            <template
                v-slot:footer
                >
                <v-fab-transition>
                    <v-btn
                        fab
                        fixed
                        dark
                        small
                        bottom
                        left
                        color="indigo"
                        class="v-btn--add-new"
                        @click="toggleAddFields()"
                    >
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </v-fab-transition>
                <div>
                    This is a footer
                </div>
            </template>
        </v-data-table>
    
    </div>
</template>

<script>
import ExpensesDataService from '../services/ExpensesDataService'
import moment from 'moment'

export default {
  name: 'ExpenseTable',
  data() {
        return {
            // const formattedDate = moment
            headers: [
                {
                    text: 'Date',
                    align: 'start',
                    sortable: true,
                    value: 'Date',
                },
                { text: 'Type', value: 'Type' },
                { text: 'Name', value: 'Name' },
                { text: 'Description', value: 'Description' },
                { text: 'Amount', value: 'Amount' },
                { text: 'Actions', value: 'Actions', sortable: false },
            ],
            expenseCategories: [
                'Loan',
                'Subscriptions',
                'Eating Out',
                'Car',
                'Personal',
                'House',
                'Groceries',
                'Travel',
                'Investment',
                'Other',
            ],
            expenseTypes: [
                'Credit',
                'Checking',
                'Savings'
            ],
            expenses: [],
            expense: {
                _id: '',
                Name: '',
                Date: '',
                Type: '',
                Description: '',
                Amount: '',
                Category: '',
            },
            listMonths: ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"],
            selectedMonth: new Date().getMonth(),
            selectedYear: new Date().getFullYear(),
            selectedRowCategory: [],
            sortBy: 'Date',
            addMode: false,
            editMode: false,
            rowIndex: undefined
        }
    },
    methods: {
        toggleAddFields() {
            this.addMode = !this.addMode
            this.closeEditMode()
        },
        getExpenses() {
            console.log(this.selectedMonth, this.selectedYear)
            ExpensesDataService.getExpensesByYearAndMonth(this.selectedYear, this.selectedMonth+1)
                .then(response => {
                    console.log(response.data.length)
                    this.expenses = []
                    response.data.forEach(element => {
                        element.Date = moment(element.Date).format('YYYY-MM-DD')
                        this.expenses.push(element)
                    });
                })
        },
        addExpense() {
            var expense = {
                _id: this.expense._id,
                Name: this.expense.Name,
                Date: this.expense.Date,
                Type: this.expense.Type,
                Description: this.expense.Description,
                Amount: this.expense.Amount,
                Category: this.selectedRowCategory[0]
            }

            ExpensesDataService.addExpense(expense)
                .then(response => {
                    console.log("Data added")
                    console.log(response.status)
                    this.getExpenses()
                })
            console.log('clicked');
            this.expense = {}

            //Can remove this. Check
            this.addMode = false
        },
        editExpense(expense, index) {
            // this.expense = expense
            this.rowIndex = index
            this.editMode = true
            this.addMode = false
            this.selectedRowCategory = [expense.Category]
            this.getExpenses()
            
        },
        closeEditMode() {
            this.editMode = false
            this.rowIndex = undefined
            this.selectedRowCategory = []
            this.getExpenses()
        },
        updateExpense(expense) {
            expense.Category = this.selectedRowCategory[0]
            console.log('before', expense)
            ExpensesDataService.updateExpense(expense)
                .then(response => {
                    console.log("Data updated")
                    console.log(response.status)
                    this.getExpenses()
                })
            this.expense = {}
            this.editMode = false
            this.rowIndex = undefined
            
        },
        deleteExpense(expense) {
            ExpensesDataService.deleteExpense(expense)
                .then(response => {
                    console.log("Data deleted")
                    console.log(response.status)
                    this.getExpenses()
                    
                })
            this.expense = {}
            this.editMode = false
            this.rowIndex = undefined
        }
    },
    //Mount the above get method for instant call to it
    mounted() {
        for (const category of this.expenseCategories) {
            const item = {
                text: category,
                value: category
            }
            this.headers.splice(this.headers.length-2, 0, item)
        }
        
        this.getExpenses()
    },
    computed: {
        checkBoxGroup: {
            get() {
                console.log("In get")
                return this.selectedRowCategory[0]
            },
            set(value) {
                console.log("In set", value)
                this.selectedRowCategory = [value]
                console.log(this.selectedRowCategory)
            }
        },
        listYears: {
            get() {
                var years = []
                for (let i = 1; i <= 20; i++) {
                    years.push(this.selectedYear+10-i)
                }
                console.log(years)
                return years
            },
        },
        selectListMonth: {
            get() {
                return this.listMonths[this.selectedMonth]
            },
            set(month) {
                this.selectedMonth = this.listMonths.indexOf(month)
                console.log(this.selectedMonth)
            }
        }
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

.v-btn--add-new {
bottom: 0;
left: 0;
margin: 0 0 16px 16px;
}
</style>