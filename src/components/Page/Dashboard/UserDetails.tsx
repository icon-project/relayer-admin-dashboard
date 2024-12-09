'use client'

import { User } from '@/utils/user'
import { faCopy, faEye } from '@fortawesome/free-regular-svg-icons'
import { faEyeLowVision } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, useState } from 'react'
import { Button, Table } from 'react-bootstrap'
import CopyToClipboard from 'react-copy-to-clipboard'

interface UserDetailsProps {
    user: User
}

const UserDetails: FC<UserDetailsProps> = ({ user }) => {
    const [showPassword, setShowPassword] = useState(false)
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }
    return (
        <Table striped bordered hover>
            <tbody>
                <tr>
                    <td>ID</td>
                    <td>{user.id}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>{user.email}</td>
                </tr>
                <tr>
                    <td>Password</td>
                    <td>
                        <span className="mr-5">{showPassword ? user.password : '********'}</span>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            className="ml-2"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <FontAwesomeIcon icon={faEyeLowVision} />
                            ) : (
                                <FontAwesomeIcon icon={faEye} />
                            )}
                        </Button>
                        <CopyToClipboard text={user.password}>
                            <Button variant="outline-secondary" size="sm" className="ml-2">
                                <FontAwesomeIcon icon={faCopy} />
                            </Button>
                        </CopyToClipboard>
                    </td>
                </tr>
                <tr>
                    <td>Company</td>
                    <td>{user.company}</td>
                </tr>
                <tr>
                    <td>Designation</td>
                    <td>{user.designation}</td>
                </tr>
            </tbody>
        </Table>
    )
}

export default UserDetails
