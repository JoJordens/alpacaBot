import { controller } from './controller.es6'

export const routes = [
/*
requests sent from desktop app or web app

post aliases
post create custom commands
post songs

get users
get command list
get aliases

more stuff?
connected servers

also delete stuff
*/
    // {
    //     method: 'POST',
    //     path: '/aliases',
    //     config: controller.postPlanning
    // },
    // {
    //     method: 'POST',
    //     path: '/command',
    //     config: controller.editPlanning
    // },
    {
        method: 'POST',
        path: '/songs',
        config: controller.postSong
    },
    // {
    //     method: 'DELETE',
    //     path: '/song',
    //     config: controller.deletePlanning
    // },
    // {
    //     method: 'GET',
    //     path: '/songs',
    //     config: controller.getPlanning
    // },
    // {
    //     method: 'GET',
    //     path: '/users',
    //     config: controller.getPlanningCount
    // }
]
