import sql from 'mssql';

const config = {
    server: "INTERN-DANGTAI",
    database: "MicrosoftList",
    user: "admin",
    password: "tai1234",
    options: {
        trustedConnection: true,
        enableArithAbort: true,
        trustServerCertificate: true,
    },
};

export const connect = () => sql.connect(config);
