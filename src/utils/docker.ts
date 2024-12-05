import Docker from 'dockerode'

const docker = new Docker({ socketPath: process.env.DOCKER_HOST || '/var/run/docker.sock' })

export const getLogs = async (
    containerId: string,
    opt: { level: string; tail: number; since?: number; until?: number }
) => {
    const container = docker.getContainer(containerId)
    if (!container) {
        throw new Error(`Container ${containerId} not found`)
    }
    const logs = await container.logs({
        follow: false,
        stdout: opt.level === 'all' || opt.level !== 'error',
        stderr: opt.level === 'all' || opt.level === 'error',
        tail: opt.tail,
        since: opt.since,
        until: opt.until,
    })
    return logs.toString()
}
