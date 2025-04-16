import { defineStore } from "pinia";
import { ref } from "vue";

export const useContactStore = defineStore('contact', () => {
    const contact = ref ([])

    function addContact(nome, foto, contato, empresa){
        contact.value.push({nome, foto, contato, empresa})
    }

    return{
        contact,
        addContact
    }
})