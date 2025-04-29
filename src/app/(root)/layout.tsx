import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
	return <div className='relative flex min-h-screen flex-col'>{children}</div>;
};

export default Layout;
