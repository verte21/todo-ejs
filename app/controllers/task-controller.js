const Task = require("../db/models/task");

class TaskController {
  async showTasks(req, res) {
    // pobierz wszystkie taski i wyświetl na widoku
    const tasks = await Task.find({});
    res.render("pages/tasks/index", { tasks: tasks });
  }

  showCreateForm(req, res) {
    // wyświetl formularz nowego taska
    res.render("pages/tasks/create");
  }

  async create(req, res) {
    const { taskName, taskDescription } = req.body;
    const task = new Task({
      title: taskName,
      description: taskDescription,
    });
    // przygotuj nowy task
    try {
      // zapisz task i przekieruj do strony głównej
      await task.save();
      res.redirect("/");
    } catch (e) {
      console.log(e);
      // jeśli są błędy, wyświetl ja na widoku
      res.render("pages/tasks/create", { errors: e.errors, form: req.body });
    }
  }

  async showEditForm(req, res) {
    // pobierz task i wyświetl formularz edycji
    const { id } = req.params;
    const task = await Task.findById(id);

    // mongoose posiada metodę .findById
    // Przykła: task = await Task.findById('60fec8c43501d21b309befbd')
    // https://mongoosejs.com/docs/api.html#model_Model.findById

    res.render("pages/tasks/edit", { task });
  }

  async edit(req, res) {
    // pobierz task
    const { id } = req.params;
    const task = await Task.findById(id);
    const { taskName, taskDescription } = req.body;

    task.title = taskName;
    task.description = taskDescription;

    await task.save();

    // zaktualizuj dane

    try {
      // zapisz i przekieruj na stronę główną
      res.redirect("/");
    } catch (e) {
      // jeśli są błędy, wyświetl ja na widoku
      res.render("pages/tasks/edit");
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
      await task.deleteOne({ _id: id });
      // usuń task i przekieruj na stronę główną
      res.redirect("/");
    } catch (e) {
      // opcjonalnie obsłuż błąd
    }
  }

  async toggleDone(req, res) {
    const { id } = req.params;
    const task = await Task.findById(id);
    task.done ? (task.done = false) : (task.done = true);
    await task.save();
    res.redirect("/");
  }
}

module.exports = new TaskController();
