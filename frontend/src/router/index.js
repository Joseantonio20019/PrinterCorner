    import { createRouter, createWebHistory } from 'vue-router';

//Importe de el componente Emails de Vue

    import Emails from '../components/Emails/Emails.vue';
    import EmailFiles from '../components/Emails/EmailFiles.vue';
    import Home from "../components/Views/Home.vue";


    const router = createRouter({

        routes:[

            //Ruta Página Principal

            {path: "/", component: Home},

            //Rutas Emails

            {path: "/emails", component: Emails},
            {path: "/getEmailFiles/:id", component: EmailFiles}


        ],

        history: createWebHistory()
    });



    export default router;


