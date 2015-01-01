var daemon = require("daemonize2").setup({
    main: "www",
    name: "WriteItDown",
    pidfile: "WriteItDown.pid"
});

switch (process.argv[2]) {
    case "start":
        daemon.start();
        break;
    case "stop":
        daemon.stop();
        break;
    default:
        consolee.log("Usage: [start|stop]");
}
