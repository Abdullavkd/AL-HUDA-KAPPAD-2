import React from 'react';
import {Link,Outlet} from 'react-router-dom';export default function AdminLayout(){return <><header className="admin-nav"><div className="container nav-wrap"><Link className="brand" to="/admin"><div className="brand-mark">AH</div><strong>Al Huda Admin</strong></Link><nav><Link to="/admin">Dashboard</Link><Link to="/admin/institutions">Institutions</Link><Link to="/admin/content">Content</Link><Link to="/admin/accounts">Accounts</Link><Link to="/">Public site</Link></nav></div></header><Outlet/></>}

