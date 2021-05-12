import { FastifyPluginAsync } from "fastify";
import { nanoid } from 'nanoid';

type TestType = {
    id: string
    title: string
    type: string
    testSegments: number[]
    referenceSegments: number[]
    startDate: number | null
    endDate: number | null
    status: string
}

let tests: TestType[] = [];

interface DeleteParams {
    id: string
}

interface PatchParams {
    id: string
}

const testsRoute: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.get('/', async function (request, reply) {
        reply.status(200).send(tests.map((test) => {
                return {
                    id: test.id,
                    title: test.title,
                    type: test.type,
                    status: test.status,
                    testSegments: test.testSegments,
                    referenceSegments: test.referenceSegments,
                    startDate: test.startDate,
                    endDate: test.endDate,
                }
            })
        )
    });

    fastify.post<{ Body: string }>('/', async function (request, reply) {
        const test = JSON.parse(request.body);

        const newTest: TestType = {
            id: nanoid(),
            title: test.title,
            type: test.type,
            testSegments: test.testSegments,
            referenceSegments: test.referenceSegments,
            startDate: null,
            endDate: null,
            status: test.activateOnUpload ? 'Active' : 'Ready for activation'
        }

        if (test.activateOnUpload) newTest.startDate = Date.now();

        tests.push(newTest);

        reply.code(201);

        return newTest;
    })

    fastify.delete<{ Params: DeleteParams }>('/:id', async function (request, reply) {
        const id = request.params.id;

        tests = tests.filter(test => test.id !== id)
        return { msg: `Test with ID ${id} is deleted` }
    });

    fastify.patch<{ Params: PatchParams, Body: string }>('/:id/status', async function(request, reply) {
        const id = request.params.id;
        const requestBody = JSON.parse(request.body);

        if (requestBody === 1) {
            tests = tests.map(test =>
                test.id === id ? { ...test, status: 'Active', startDate: Date.now() } : test
            )
        }

        if (requestBody === 2) {
            tests = tests.map(test =>
                test.id === id ? { ...test, status: 'Ended', endDate: Date.now() } : test
            )
        }

        return { msg: `Test with ID ${id} is changed` };
    });

}

export default testsRoute;
