import { defineStore } from "pinia";
import { ref } from "vue";

export const useContactStore = defineStore('contact', () => {
    const contact = ref ([])

    function addContact(nome, foto, contatoInfo, empresa){
        contact.value.push({nome, foto, contato: contatoInfo, empresa})
    }

    function updateContact(index, nome, foto, contatoInfo, empresa){
        if(contact.value[index]){
            contact.value[index] = { nome, foto, contato: contatoInfo, empresa};
        }
    }

    function deleteContact(index){
        contact.value.splice(index, 1);
    }

    return{
        contact,
        addContact,
        updateContact,
        deleteContact
    }
})