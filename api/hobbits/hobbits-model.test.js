const db = require('../../data/dbConfig')
const Hobbit = require('./hobbits-model')

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})

beforeEach(async () => {
    await db.seed.run()
})

afterAll(async () => {
    await db.destroy()
})

test('environment is testing', () => {
    expect(process.env.NODE_ENV).toBe('testing')
})

describe('getAll', () => {
    test('resolves all the hobbits in the table', async () => {
        const result = await Hobbit.getAll()
        expect(result).toHaveLength(4)
        expect(result[0]).toMatchObject({name: 'sam'})
        expect(result[1]).toMatchObject({name: 'frodo'})
        expect(result[2]).toMatchObject({name: 'pippin'})
        expect(result[3]).toMatchObject({name: 'merry'})
    })
})

describe('getById', () => {
    test('resolves the hobbit by the given id', async () => {
        let result = await Hobbit.getById(1)
        expect(result).toMatchObject({name: 'sam'})
         result = await Hobbit.getById(2)
        expect(result).toMatchObject({name: 'frodo'})
         result = await Hobbit.getById(3)
        expect(result).toMatchObject({name: 'pippin'})
         result = await Hobbit.getById(4)
        expect(result).toMatchObject({name: 'merry'})
    })
})

describe('insert', () => {
    const bilbo = {name: 'bilbo'}
    test('resolves the newly created hobbits', async () => {
        const result = await Hobbit.insert(bilbo)
        expect(result).toMatchObject(bilbo)
    })
    test('adds the hobbit to the hobbits table', async () => {
        await Hobbit.insert(bilbo)
        const records = await db('hobbits')
        expect(records).toHaveLength(5)
    })
})

describe('update', () => {
    test('updates information within hobbit database', async () => {
        await Hobbit.insert({name: 'gaffer'})
        const updated = await Hobbit.update(1, {name: 'sam'})
        expect(updated).toMatchObject({id: 1, name: 'sam'})
    })
})

describe('remove()', () => {
    test('deletes hobbit from table by id', async () => {
        await Hobbit.remove(1)
        const hobbits = await db('hobbits')
        expect(hobbits).toHaveLength(3)

    })
})