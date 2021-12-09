import http from '../http-common';

class ExpensesDataService {
    getAllExpenses() {
        return http.get('/getExpenses')
    }

    addExpense(expense) {
        return http.post('/addExpense', expense)
    }

    updateExpense(expense) {
        return http.post('/updateExpense', expense)
    }

    deleteExpense(expense) {
        return http.delete('/deleteExpense', { data: expense})
    }
}

export default new ExpensesDataService();