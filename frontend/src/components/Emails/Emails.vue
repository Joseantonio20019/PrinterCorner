<template>
  
  <div class="container mt-5 w-50">
    <h1>Emails</h1>    
    <div class="row">
      <div class="col-md-12">
        <div class="table-wrap">
          <table class="table">
            <thead class="thead-dark">
              <tr>
                <th>ID</th>
                <th>Asunto</th>
                <th>Enviado Por</th>
                <th>Recibido</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="email in emails" v-bind:key="email.id">
                <td>{{email.id}}</td>
                <td>{{ email.subject }}</td>
                <td>{{ email.from }}</td>
                <td>{{email.createdAt}}</td>
                <div class="d-flex justify-content-between">
                <router-link class= " btn btn-success text-dark" :to="`/getEmailFiles/${email.id}`">Ver Archivos</router-link>
                <button class="btn btn-danger text-dark" @click="deleteEmail(email.id)">Borrar</button>
                </div>
              </tr>
            </tbody>
          </table>
        </div>
        <h2 class="mt-5 text-center" v-if="emails == ''">No se han encontrado emails</h2>
      </div>
    </div>
  </div>
</template>


<script setup>

//Importe de los módulos

    import { onMounted } from '@vue/runtime-core';
    import axios from 'axios';
    import { ref } from 'vue';


//Declaración de las variables

    const emails = ref([]);



//FUNCIONES 

    const getEmails = async () => {

        axios.get('http://localhost:3000/emails').then((response) => {

            emails.value = response.data;

        })

    }

    onMounted(async () => {

        getEmails();

    });

    const deleteEmail = (id) => {

      axios.post(`http://localhost:3000/deleteEmail/${id}`).then(() => {

        getEmails();

      });
    };

</script>