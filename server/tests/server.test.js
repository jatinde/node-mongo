const expect = require('expect');
const request = require('supertest');
const { ObjectId } = require('mongodb')

const { app } = require('../server')
const {Todo} = require('../models/todo')

const todos = [{
    _id: new ObjectId(),
    text: "First todo."
}, {
    _id: new ObjectId(),
    text: "Second todo.",
    completed: true,
    completedAt: 12345
}]

beforeEach(done => {
    Todo.remove({})
    .then(() => Todo.insertMany(todos))
    .then(()=> done())
})

describe('Post /todos', () => {
    it('should create new todo', (done) => {
        const text = 'test text.'

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find({text}).then(todos => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(e => done(e))
            })
    })

    it('should not create todo for invalid body', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find().then(todos => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(e => done(e))
            })
    })

    describe('GET /todos', () => {
        it('should get all todos.', (done) => {
            request(app)
            .get('/todos')
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
        })
    })

    describe('GET /todos/:id', () => {

        it('should get valid todo.', (done) => {
            request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[0].text).toBeA('string')
            })
            .end(done)
        })

        it('should return 404 if todo not found.', (done) => {
            request(app)
            .get(`/todos/${new ObjectId()}`)
            .expect(404)
            .expect(res => {
                expect(res.body.status).toBe('NOT_FOND').toBeA('string')
            })
            .end(done)
        })

        it('should return BAD_Request (404) if id invalid.', (done) => {
            request(app)
            .get(`/todos/${new ObjectId().toHexString+'45'}`)
            .expect(400)
            .expect(res => {
                expect(res.body.status).toBe('BAD_REQUEST').toBeA('string')
            })
            .end(done)
        })
    })
})

describe('DELETE /todos/:id', () => {

    it('should able to delete todo.', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect(res => {
            expect(res.body.todo.text).toBe(todos[0].text).toBeA('string')
        })
        .end(done)
    })

    it('should return 404 if todo not found for delete.', (done) => {
        request(app)
        .get(`/todos/${new ObjectId()}`)
        .expect(404)
        .expect(res => {
            expect(res.body.status).toBe('NOT_FOND').toBeA('string')
        })
        .end(done)
    })

    it('should return BAD_Request (404) if id invalid.', (done) => {
        request(app)
        .get(`/todos/${new ObjectId().toHexString+'45'}`)
        .expect(400)
        .expect(res => {
            expect(res.body.status).toBe('BAD_REQUEST').toBeA('string')
        })
        .end(done)
    })
})

    describe('PATCH /todos/:id', () => {
        const text = 'Updated text for second todo text'
        it('should update todo.', (done) => {
            request(app)
            .patch(`/todos/${todos[0]._id.toHexString()}`)
            .send({text, completed: true})
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(text).toBeA('string')
                expect(res.body.todo.completed).toBe(true).toBeA('boolean')
                expect(res.body.todo.completedAt).toBeA('number')
            })
            .end(done)
        })
    
        it('should clear completedAt when complete set to false.', (done) => {
            request(app)
            .patch(`/todos/${todos[1]._id.toHexString()}`)
            .send({completed: false})
            .expect(200)
            .expect(res => {
                expect(res.body.todo.completed).toBe(false).toBeA('boolean')
                expect(res.body.todo.completedAt).toNotExist()
            })
            .end(done)
        })
})
