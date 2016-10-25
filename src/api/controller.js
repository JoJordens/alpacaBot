// import Joi from 'joi';
// import {Planning} from '../models/planning.es6';
// import {Project} from '../models/project.es6';
// import {sendLog, actionLog} from '../sendLog.es6';
import async from 'async';
// import unirest from 'unirest';
// import mongoose from 'mongoose';
import _ from 'underscore';
import moment from 'moment';

export const controller = {
    postSong: {
        // auth: {
        //     strategy: 'tokenDefault',
        //     mode: 'required',
        //     scope: ['ADMIN+', 'ADMIN', 'EMPLOYEE', 'FREELANCER']
        // },
        // tags: ['api'],
        // description: 'Add a project to the planning.',
        // validate: {
        //     payload: {
        //         user: Joi.string().required(),
        //         project: Joi.string().required(),
        //         visit_by: Joi.string().required(),
        //         planned_date: Joi.string().required(),
        //         project_was_passed: Joi.boolean()
        //     }
        // },
        handler(request, reply) {
            const payload = request.payload;
            async.series([
                function (callback) {
                    if ( payload.project_was_passed ) {
                        Planning.update({project: payload.project, deleted: false, visited: false}, {$set: {deleted: true}}, function(error) {
                            if ( error ) {
                                callback(error);
                            } else {
                                callback();
                            }
                        });
                    } else {
                        callback();
                    }
                }
            ], function (error) {
                if ( error ) {
                    return reply(error).code(500);
                }

                Planning.find({project: payload.project, deleted: false, visited: false}, function(error, planning) {
                    if ( !error && !planning.length ) {
                        const planning = new Planning(payload);
                        planning.save((error, planning) => {
                            if ( !error ) {
                                actionLog({
                                    who: {type: 'User', object: request.auth.credentials.userId},
                                    what: {type: 'Planning', object: planning._id},
                                    how: 'created',
                                    when: new Date(),
                                    where: payload.project
                                });
                                return reply(planning);
                            } else {
                                return reply(error);
                            }
                        });
                    } else {
                        if ( error ) {
                            return reply(new Error(error));
                        } else {
                            return reply({message: 'werf is al ingepland'}).code(400);
                        }
                    }
                });
            });
        }
    }
}
