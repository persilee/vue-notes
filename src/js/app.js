const Editor = {
    props: [
        'entityObject'
    ],
    data() {
        return {
            entity: this.entityObject
        }
    },
    methods:{
        update() {
            this.$emit('update')
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
                    @input="update"
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
            entity: this.entityObject,
            open: false,
        }
    },
    components: {
        Editor,
    },
    computed: {
        header() {
            return _.truncate(this.entity.body, {
                length: 30
            })
        }
    },
    methods: {
        save() {
            loadCollection('notes')
                .then((collection) => {
                    collection.update(this.entity)
                    db.saveDatabase()
                })
        }
    },
    template: `
        <div class="item">
            <div class="content">
                <div 
                    class="header" 
                    @click="open = !open"
                >
                    {{ header || '新建笔记' }}
                </div>
                <div class="extra">
                    <editor 
                        :entity-object="entity"
                        v-if="open"
                        @update="save"
                    >
                    </editor>
                </div>
            </div>
        </div>
    `,
}

const Message = {
    props: [
        'messageText'
    ],
    template: `
        <div class="ui small icon message">
            <i class="bullhorn icon"></i>
            <div class="content">
                <p v-html="messageText"></p>
            </div>
        </div>
    `
}

const Notes = {
    components: {
        Note,
        Message,
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
        create() {
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
            <message 
                message-text="点击 <strong>添加笔记</strong> 按钮可新增笔记，点击 <strong>笔记标题</strong> 可显示笔记详情，笔记可自动保存。"
            ></message>
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