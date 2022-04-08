
<template>
  
  <div class="container mt-5 w-50">
    <h1>Archivos</h1>    
    <div class="row">
      <div class="col-md-12">
        <div class="table-wrap">
          <table class="table">
            <thead class="thead-dark">
              <tr>
                <th>Nombre</th>
                <th>Tipo Archivo</th>
                <th>Tamaño</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="file in emailFiles" v-bind:key="file.id">
                <td>{{ file.name }}</td>
                <td>{{ file.contentType }}</td>
                <td>{{file.contentLength}} KB</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h2 class="mt-5 text-center" v-if="emailFiles == ''">No hay archivos en este correo</h2>
      </div>
    </div>
  </div>
</template>

<script setup>

    import axios from 'axios';
    import { ref } from 'vue';
    import { onMounted } from 'vue';
    import {useRoute,useRouter} from 'vue-router';


    const router = useRoute();
    const id = router.params.id;
    const emailFiles = ref([]);



    async function getEmailFiles() {

        await axios.get(`http://localhost:3000/getEmailFiles/${id}`).then((response) => {

            emailFiles.value = response.data;

        })

    }


    onMounted(async () => {

        await getEmailFiles();

    });

</script>
    





