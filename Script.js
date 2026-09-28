$(document).ready(function () {

  $("#github-form").on("submit", function (event) {
    event.preventDefault();

    const username = $("#username").val().trim();

    if (!username) {
      return;
    }

    $("#message").html(
      '<div class="alert alert-info">Loading...</div>'
    );

    $("#repo-table").addClass("d-none");
    $("#repo-body").empty();
    $("#user-info").empty();

    // Get GitHub user information
    $.get("https://api.github.com/users/" + encodeURIComponent(username))
      .done(function (user) {

        $("#user-info").html(
          '<h2 class="h4">Repositories of ' +
          $("<div>").text(user.login).html() +
          "</h2>"
        );

        // Get repositories
        $.get(user.repos_url, {
          per_page: 100,
          sort: "updated"
        })
        .done(function (repos) {

          $("#message").empty();

          if (repos.length === 0) {
            $("#message").html(
              '<div class="alert alert-warning">' +
              'This user has no public repositories.' +
              '</div>'
            );
            return;
          }

          $.each(repos, function (index, repo) {

            const name =
              $("<div>").text(repo.name).html();

            const description = repo.description
              ? $("<div>").text(repo.description).html()
              : "No description";

            $("#repo-body").append(
              "<tr>" +
                '<td><a href="' + repo.html_url +
                '" target="_blank">' +
                name +
                "</a></td>" +
                "<td>" + description + "</td>" +
                "<td>" + user.followers + "</td>" +
              "</tr>"
            );
          });

          $("#repo-table").removeClass("d-none");
        })

        .fail(function () {
          $("#message").html(
            '<div class="alert alert-danger">' +
            'Could not load the repositories.' +
            '</div>'
          );
        });
      })

      .fail(function (xhr) {

        let text = "There was an error connecting to the GitHub API.";

        if (xhr.status === 404) {
          text = "GitHub user not found.";
        }

        $("#message").html(
          '<div class="alert alert-danger">' +
          text +
          '</div>'
        );
      });
  });

});
