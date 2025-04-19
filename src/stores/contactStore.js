import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../services/api";

export const useContactStore = defineStore('contact', () => {
    const contact = ref ([])

    async function addContact(nome, fotoBase64, contatoInfo, empresaId){
        const formData = new FormData();
        formData.append('name', nome);
        formData.append('whatsapp', contatoInfo);
        formData.append('store_id', empresaId);

        if(fotoBase64){
            const blob = await fetch(fotoBase64).then(r => r.blob());
            const mimeType = blob.type;
            const extension = mimeType.split('/')[1];
            const filename = `foto.${extension.replace('+xml', '')}`;
            formData.append('photo', blob, filename);
            
            console.log('Dados enviados ao backend:');
            for (let pair of formData.entries()) {
              console.log(`${pair[0]}:`, pair[1]);
            }

        } try {
            const { data } = await api.post('/contacts', formData);

            contact.value.push({
                id: data.id,
                nome: data.name,
                contato: data.whatsapp,
                foto: data.photo,
                empresa: data.store_id,
            });
        } catch(error){
            console.error('Erro ao adicionar contato:', error.response?.data || error);

            throw error;
        }

    }

    function updateContact(){
        
    }

    function deleteContact(){
        
    }

    return{
        contact,
        addContact,
        updateContact,
        deleteContact
    }
})