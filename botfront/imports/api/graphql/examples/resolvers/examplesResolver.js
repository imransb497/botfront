import {
    getExamples,
    listIntentsAndEntities,
    insertExamples,
    updateExample,
    deleteExamples,
    switchCanonical,
} from '../mongo/examples.js';

const { PubSub, withFilter } = require('apollo-server-express');

const pubsub = new PubSub();
const INTENTS_OR_ENTITIES_CHANGED = 'INTENTS_OR_ENTITIES_CHANGED';

const publishIntentsOrEntitiesChanged = (projectId, language) => pubsub.publish(
    INTENTS_OR_ENTITIES_CHANGED,
    { projectId, language, intentsOrEntitiesChanged: { changed: true } },
);

export default {
    Query: {
        async examples(_, { exactMatch, ...args }, __) {
            return getExamples({ ...args, options: { exactMatch } });
        },
        async listIntentsAndEntities(_, args, __) {
            return listIntentsAndEntities(args);
        },
    },
    Subscription: {
        intentsOrEntitiesChanged: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([INTENTS_OR_ENTITIES_CHANGED]),
                (payload, variables) => payload.projectId === variables.projectId
                    && payload.language === variables.language,
            ),
        },
    },
    Mutation: {
        async updateExample(_, args, __) {
            const response = await updateExample(args);
            if (response.success) {
                const { projectId, language } = args.example;
                publishIntentsOrEntitiesChanged(projectId, language);
            }
            return response;
        },
        async insertExamples(_, args, __) {
            const response = await insertExamples(args);
            if (response.success) {
                const { projectId, language } = args;
                publishIntentsOrEntitiesChanged(projectId, language);
            }
            return response;
        },
        async deleteExamples(_, args, __) {
            const response = await deleteExamples(args);
            return response;
        },
        async switchCanonical(_, args, __) {
            const response = await switchCanonical(args);
            return response;
        },
    

    },

    ExamplePage: {
        examples: (parent, _, __) => parent.examples,
        pageInfo: (parent, _, __) => parent.pageInfo,
    },
    IntentsAndEntitiesList: {
        intents: ({ intents }) => intents,
        entities: ({ entities }) => entities,
    },
    Example: {
        projectId: (parent, _, __) => parent.projectId,
        _id: (parent, _, __) => parent._id,
        text: (parent, _, __) => parent.text,
        intent: (parent, _, __) => parent.intent,
        entities: (parent, _, __) => parent.entities,
        metadata: (parent, _, __) => parent.metadata,
    },
    PageInfo: {
        endCursor: (parent, _, __) => parent.endCursor,
        hasNextPage: (parent, _, __) => parent.hasNextPage,
    },
};
