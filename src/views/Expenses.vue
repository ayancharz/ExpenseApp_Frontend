<template>
    <div id='main'>
        <expense-table/>
    </div>
</template>

<script>
import ExpenseTable from '../components/ExpenseTable.vue'

export default {
  components: { ExpenseTable },
    name: "get-expenses"
}
</script>