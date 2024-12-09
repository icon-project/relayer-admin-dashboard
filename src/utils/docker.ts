import Docker from 'dockerode'

const docker = new Docker({ socketPath: process.env.DOCKER_HOST || '/var/run/docker.sock' })

interface LogOptions {
    tail: number
    since?: number
    until?: number
}

export const getLogs = async (id: string, opt: LogOptions): Promise<string[]> => {
    try {
        const container = docker.getContainer(id)
        if (!container) {
            throw new Error(`Container ${id} not found`)
        }
        const logs = await container.logs({
            stdout: true,
            stderr: true,
            tail: opt.tail,
            since: opt.since,
            until: opt.until,
        })
        return logs.toString('utf-8').split('\n')
    } catch (error) {
        console.error('Failed to fetch logs:', error)
        return []
    }
}

export const getStats = async (id: string): Promise<Docker.ContainerStats> => {
    try {
        const container = docker.getContainer(id)
        if (!container) {
            throw new Error(`Container ${id} not found`)
        }
        const stats = await container.stats({ stream: false })
        return stats
    } catch (error) {
        console.error('Failed to fetch stats:', error)
        return {} as Docker.ContainerStats
    }
}
