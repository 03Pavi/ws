'use client'
import { useAppSelector, useAppDispatch } from '@/shared/lib/hooks';
import { setUser, clearUser } from '@/entities/user/model/slice';

const UserInfo = () => {
    const dispatch = useAppDispatch();
    const { name, email } = useAppSelector((state) => state.user);

    return (
        <div>
            <h1>User Info</h1>
            <p>Name: {name}</p>
            <p>Email: {email}</p>
            <button onClick={() => dispatch(setUser({ name: 'John', email: 'john@example.com' }))}>
                Set User
            </button>
            <button onClick={() => dispatch(clearUser())}>Clear User</button>
        </div>
    );
};

export default UserInfo;
