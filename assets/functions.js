var app = new Vue({
  el: "#app",
  data: {
    currentText: "",
    newID: 2,
    todos: [],
    isEditing: false,
    editingID: 0,
    visibleState: "all",
  },
  methods: {
    fetchData: function () {
      let data = fetch("http://api.local/index.asp")
        .then((response) => response.json())
        .then((_data) => {
          return _data;
        })
        .catch(() => {
          data = [];
        });
      return data;
    },
    addTodo: async function () {
      if (this.currentText !== "") {
        let result;

        if (this.isEditing && this.editingID !== 0) {
          result = await this.updateContentTodo(
            escape(this.currentText),
            this.editingID
          );
        } else {
          let _url =
            "http://api.local/insert.asp?text=" + escape(this.currentText);
          result = await fetch(_url)
            .then((response) => response.json())
            .then((data) => data);
        }
        if (result.status === "1") {
          this.vm.todos = [...(await this.fetchData())];
        }
        this.currentText = "";
        this.isEditing = false;
        this.editingID = 0;
      }
    },
    updateContentTodo: async function (content, id) {
      let _url = "http://api.local/update.asp?id=" + id + "&text=" + content;
      return await fetch(_url)
        .then((response) => response.json())
        .then((data) => data);
    },
    updateStatusTodo: async function (todo) {
      let _url = `http://api.local/update_stat.asp?id=${todo.id}&status=${
        todo.status ? "0" : "1"
      }`;
      let result = await fetch(_url)
        .then((response) => response.json())
        .then((data) => {
          return data;
        });
      if (result.status == 1) {
        this.vm.todos = [...(await this.fetchData())];
      }
    },
    editTodo: function (todo) {
      this.editingID = todo.id;
      this.isEditing = true;
      this.currentText = todo.text;
    },
    deleteTodo: async function (todo, key) {
      let _url = "http://api.local/delete.asp?id=" + todo.id;
      let result = await fetch(_url)
        .then((response) => response.json())
        .then((data) => data);

      if (result.status == 1) {
        this.vm.todos = [...(await this.fetchData())];
      }
    },
    filterTodos: async function (state, event) {
      let todoList = await this.fetchData();

      event.target.parentNode.parentNode
        .querySelectorAll("button")
        .forEach((element) => {
          element.classList.remove("active");
        });
      event.target.classList.add("active");
      if (state === "completed") {
        todoList = todoList.filter((todo) => todo.status === 1);
      }
      if (state === "doing") {
        todoList = todoList.filter((todo) => todo.status === 0);
      }

      this.vm.todos = todoList;
    },
  },
  computed: {},
  created: async function () {
    let newData = await this.fetchData();

    this.vm = this;
    this.vm.todos = [...newData];
  },
});
