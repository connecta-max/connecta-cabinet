<template>
  <EmployeeCard :employee-id="employeeId" />
</template>

<script setup lang="ts">
const route = useRoute()
const employeeId = Number(route.params.id)
</script>
