const Editor = {
    props: [
        'entityObject'
    ],
    data(){
        return {
            entity: this.entityObject
        }
    },
    template: `
        <div class="ui form">
            <div class="field">
                <textarea 
                    cols="30" 
                    rows="5" 
                    placeholder="写点啥..."
                    v-model="entity.body"
                ></textarea>
            </div>
        </div>
    `
}

const Note = {
    props: [
        'entityObject'
    ],
    data() {
        return {
            entity: this.entityObject
        }
    },
    components: {
        Editor,
    },
    template: `
        <div class="item">
            <div class="content">
                <div class="header">
                    {{ entity.body || '新建笔记' }}
                </div>
                <div class="extra">
                    <editor 
                        :entity-object="entity"
                    >
                    </editor>
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
                    .simplesort('$loki', true)
                    .data();
                this.entities = _entities;
                console.log(this.entities);
            })
    },
    methods: {
        create(){
            loadCollection('notes')
                .then((collection) => {
                   const entity = collection.insert({
                        body: ''
                    })
                    db.saveDatabase()
                    this.entities.unshift(entity)
                })
        }
    },
    template: `
        <div class="ui container notes">
            <h4 class="ui horizontal divider header">
                <i class="bookmark outline icon"></i>
                Notes App with Vue.js
            </h4>
            <a 
                class="ui right floated basic violet button"
                @click="create"
            >添加笔记</a>
            <div class="ui divided items">
                <note 
                v-for="entity in entities"
                :entity-object="entity"
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