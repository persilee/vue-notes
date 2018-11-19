const Note = {
    props: [
        'entityObject'
    ],
    data() {
        return {
            entity: this.entityObject
        }
    },
    template: `
        <div class="item">
            <div class="content">
                <div class="header">
                    {{ entity.body }}
                </div>
            </div>
        </div>
    `,
}

const Notes = {
    components: {
        Note,
    },
    data() {
        return {
            entities: []
        }
    },
    created() {
        loadCollection('notes')
            .then(collection => {
                const _entities = collection.chain()
                    .find()
                    .simplesort('$loki', 'isdesc')
                    .data();
                this.entities = _entities;
                console.log(this.entities);
            })
    },
    template: `
        <div class="ui container notes">
            <h4 class="ui horizontal divider header">
                <i class="bookmark outline icon"></i>
                Notes App with Vue.js
            </h4>
            <a class="ui right floated basic violet button">添加笔记</a>
            <div class="ui divided items">
                <note 
                v-for="entity in entities"
                :entityObject="entity"
                :key="entity.$loki"
                ></note>
            </div>
            
        </div>
    `,
}

const app = new Vue({
    el: '#app',
    components: {
        'notes': Notes,
    },
    template: `
        <notes></notes>
    `,
})