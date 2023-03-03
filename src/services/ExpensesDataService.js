import http from '../http-common';

class ExpensesDataService {
    getAllExpenses() {
        return http.get('/expenses/getExpenses')
    }

    getExpensesByYearAndMonth(year, month) {
        return http.get('/expenseDataVis/getByMonthAndYear?year='+year+"&month="+month)
    }

    addExpense(expense) {
        return http.post('/expenses/addExpense', expense)
    }

    updateExpense(expense) {
        return http.post('/expenses/updateExpense', expense)
    }

    deleteExpense(expense) {
        return http.delete('/expenses/deleteExpense', { data: expense})
    }
}

export default new ExpensesDataService();