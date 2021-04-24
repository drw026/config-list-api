import { FastifyPluginAsync } from "fastify";
import { nanoid } from 'nanoid';

type TestType = {
    id: string
    title: string
    type: string
    testSegments: number[]
    referenceSegments: number[]
    activateOnUpload: boolean
    startDate: number | null
    endDate: number | null
    status: string
}

const tests: TestType[] = [];

const sleep = (seconds: number) => new Promise(resolve => setTimeout(resolve, (seconds * 1000)));

const testsRoute: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.get('/', async function (request, reply) {
        reply.status(200).send(tests.map((test) => {
                return {
                    id: test.id,
                    title: test.title,
                    type: test.type,
                    status: test.status,
                    startDate: test.startDate,
                    endDate: test.endDate,
                }
            })
        )
    });

    fastify.post<{ Body: TestType }>('/', async function (request, reply) {
        const {
            title,
            type,
            testSegments,
            referenceSegments,
            activateOnUpload
        } = request.body

        const newTest: TestType = {
            id: nanoid(),
            title,
            type,
            testSegments,
            referenceSegments,
            activateOnUpload,
            startDate: null,
            endDate: null,
            status: activateOnUpload ? 'Active' : 'In progress'
        }

        // wait 0, 1, 2, 3 seconds
        await sleep(Math.floor(Math.random() * 3));

        newTest.startDate = Date.now();

        tests.push(newTest);

        reply.code(201);

        return newTest;
    })
}

export default testsRoute;
