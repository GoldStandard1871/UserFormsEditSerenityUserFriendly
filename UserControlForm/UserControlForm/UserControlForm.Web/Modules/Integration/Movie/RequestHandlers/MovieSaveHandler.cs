using Serenity.Services;
using MyRequest = Serenity.Services.SaveRequest<UserControlForm.Integration.MovieRow>;
using MyResponse = Serenity.Services.SaveResponse;
using MyRow = UserControlForm.Integration.MovieRow;

namespace UserControlForm.Integration;

public interface IMovieSaveHandler : ISaveHandler<MyRow, MyRequest, MyResponse> { }

public class MovieSaveHandler : SaveRequestHandler<MyRow, MyRequest, MyResponse>, IMovieSaveHandler
{
    public MovieSaveHandler(IRequestContext context)
            : base(context)
    {
    }
}