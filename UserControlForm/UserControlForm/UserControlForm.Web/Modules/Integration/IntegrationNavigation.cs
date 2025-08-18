using Serenity.Navigation;
using MyPages = UserControlForm.Integration.Pages;

[assembly: NavigationMenu(5000, "Integration", icon: "fa-plug")]
[assembly: NavigationLink(5100, "Integration/Movies", typeof(MyPages.MoviePage), icon: "fa-film")]